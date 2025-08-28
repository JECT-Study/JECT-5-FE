import crypto from "crypto"
import fs from "fs"
import { glob } from "glob"
import path from "path"
const { spawn } = await import("child_process")

const buildDir = path.join(import.meta.dirname, "../.next")
const cacheFile = path.join(import.meta.dirname, "../test-cache-map.json")

function calculateHash(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex")
}

// sourceMap에서 sourcesContent만 추출하는 함수
function parseSourceMap(content: string) {
  try {
    // sourceMappingURL= 라인을 찾기
    const sourceMapMatch = content.match(
      /\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,([^\s]+)/,
    )
    if (!sourceMapMatch || !sourceMapMatch[1]) {
      return content
    }

    // base64 부분 추출 및 디코딩
    const base64Data = sourceMapMatch[1]
    const decodedData = Buffer.from(base64Data, "base64").toString("utf-8")
    // JSON 파싱해서 sourcesContent만 추출
    const sourceMap = JSON.parse(decodedData)

    if (sourceMap.sourcesContent && Array.isArray(sourceMap.sourcesContent)) {
      // sourcesContent 배열의 모든 내용을 합쳐서 반환
      return sourceMap.sourcesContent.join("")
    }
    console.log("없음")
    return content
  } catch (error) {
    console.error("Error parsing source map:", error)
    return content
  }
}

//e2e 테스트파일의 실제 테스트 라우트 찾기
async function findTestRoutes(pattern: string = "**/*.spec.ts") {
  const testFiles = await glob(pattern)

  // 테스트 파일 경로를 실제 Next.js 라우트로 변환
  const routes = testFiles.map((filePath) => {
    // src/app/ 이후의 경로를 추출
    const appPath = filePath.replace(/^src\/app\//, "")

    // __tests__ 폴더가 바로 시작되는 경우 (루트 경로)
    if (appPath.startsWith("__tests__/")) {
      return "/"
    }

    // __tests__ 폴더와 .spec.ts 파일 제거
    const routePath = appPath
      .replace(/\/__tests__\/.*$/, "") // __tests__ 폴더 이후 제거
      .replace(/\.spec\.ts$/, "") // .spec.ts 확장자 제거

    // 빈 문자열이면 루트 경로
    if (!routePath) return "/"

    // [gameId] 같은 동적 라우트는 그대로 유지
    return `/${routePath}`
  })

  return {
    testFiles,
    routes,
  }
}

// 캐시 파일 읽기
function loadCache(): Record<string, string> {
  try {
    if (fs.existsSync(cacheFile)) {
      const cacheContent = fs.readFileSync(cacheFile, "utf8")
      return JSON.parse(cacheContent)
    }
  } catch (error) {
    console.warn("Warning: Could not load cache file:", error)
  }
  return {}
}

// 캐시 파일 저장
function saveCache(cache: Record<string, string>) {
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2))
  } catch (error) {
    console.error("Error: Could not save cache file:", error)
  }
}

// 테스트 실행 함수 (모든 테스트를 한 번에 실행)
async function runTests(testFiles: string[]) {
  console.log(`🧪 Running tests: ${testFiles.join(", ")}`)

  try {
    return new Promise<void>((resolve, reject) => {
      const escapedTestFiles = testFiles.map((file) => {
        // 대괄호만 escape 처리
        const escaped = file.replace(/\[/g, "\\[").replace(/\]/g, "\\]")
        return `"${escaped}"`
      })

      const testProcess = spawn(
        "yarn",
        [
          "playwright",
          "test",
          "--config=playwright.config.ts",
          ...escapedTestFiles,
        ],
        {
          stdio: "inherit",
          cwd: import.meta.dirname + "/..",
          shell: true,
        },
      )

      testProcess.on("close", (code) => {
        if (code === 0) {
          console.log(`✅ All tests passed!`)
          resolve()
        } else {
          console.log(`❌ Some tests failed (exit code: ${code})`)
          reject(new Error(`Tests failed with exit code ${code}`))
        }
      })

      testProcess.on("error", (error) => {
        console.error(`Error running tests:`, error)
        reject(error)
      })
    })
  } catch (error) {
    console.error(`Failed to run tests:`, error)
    throw error
  }
}

// Manifest 파일들이 존재하는지 확인
const routeManifestPath = path.join(buildDir, "app-path-routes-manifest.json")
const buildManifestPath = path.join(buildDir, "app-build-manifest.json")

if (!fs.existsSync(routeManifestPath)) {
  console.error(`❌ Route manifest file not found: ${routeManifestPath}`)
  console.error("Please run 'yarn build' first to generate manifest files.")
  process.exit(1)
}

if (!fs.existsSync(buildManifestPath)) {
  console.error(`❌ Build manifest file not found: ${buildManifestPath}`)
  console.error("Please run 'yarn build' first to generate manifest files.")
  process.exit(1)
}

const routeManifest = JSON.parse(fs.readFileSync(routeManifestPath, "utf8"))

const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, "utf8"))

// 실행 및 캐시 기반 테스트 실행
async function main() {
  const { testFiles, routes } = await findTestRoutes()
  const cache = loadCache()
  const newCache: Record<string, string> = {}
  const testsToRun: string[] = []

  console.log("🔍 Checking test cache...")

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    const testFile = testFiles[i]

    //client 파일 해시 계산
    const matchingKey = Object.keys(routeManifest).find(
      (key) => routeManifest[key] === route,
    )

    const buildFiles = buildManifest["pages"][matchingKey!]

    let combinedContent = "" //전체 파일들을 모아서 해시 계산

    if (buildFiles && Array.isArray(buildFiles)) {
      buildFiles.forEach((file) => {
        try {
          const filePath = path.join(buildDir, file)
          const content = fs.readFileSync(filePath, "utf8")

          combinedContent += parseSourceMap(content)
        } catch (error) {
          console.warn(`Warning: Could not read file ${file}:`, error)
        }
      })
    }
    //테스트파일 해시 계산
    const testFileContent = fs.readFileSync(testFile, "utf8")
    combinedContent += testFileContent

    // 테스트코드에서 import하는 파일에 대한 해시 계시나
    // POM을 찾는 것이 목적 - 간단하게 처리
    const importPattern =
      /(?:import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g
    let match
    while ((match = importPattern.exec(testFileContent)) !== null) {
      const importPath = match[1] || match[2]

      if (
        importPath &&
        (importPath.startsWith("./") || importPath.startsWith("../"))
      ) {
        try {
          const testFileDir = path.dirname(testFile)
          const globPattern = path.resolve(testFileDir, importPath)

          const files: string[] = []

          const extensions = [".ts", ".tsx", ".js", ".jsx"]

          extensions.forEach((ext) => {
            const file = fs.existsSync(globPattern + ext)
            if (file) {
              files.push(globPattern + ext)
            }
          })

          if (files.length > 0) {
            const actualPath = path.resolve(testFileDir, files[0])
            const importContent = fs.readFileSync(actualPath, "utf8")
            combinedContent += importContent
          }
        } catch (error) {
          console.warn(
            `Warning: Could not read import file ${importPath}:`,
            error,
          )
        }
      }
    }

    //서버 해시계산
    const serverPagePath = path.join(buildDir, "server/app", route, "page.js")
    const serverPageContent = fs.readFileSync(serverPagePath, "utf8")

    if (serverPageContent) {
      combinedContent += parseSourceMap(serverPageContent)
    }

    const nftPath = path.join(buildDir, "server/app", route, "page.js.nft.json")

    const nftJson = JSON.parse(fs.readFileSync(nftPath, "utf8"))

    if (nftJson) {
      // NFT 파일의 상대 경로는 빌드된 JS 파일의 디렉토리를 기준으로 함
      const jsFileDir = path.dirname(nftPath)

      nftJson["files"].forEach((file: string) => {
        if (
          file.includes("package.json") ||
          file.includes("webpack-runtime.js") ||
          file.includes("page_client-reference-manifest.js")
        ) {
          return
        }

        const filePath = path.resolve(jsFileDir, file)
        const content = fs.readFileSync(filePath, "utf8")

        combinedContent += parseSourceMap(content) || content
      })
    }

    const currentHash = calculateHash(combinedContent)

    if (cache[testFile] === currentHash) {
      console.log(`✅ Cache HIT: ${testFile} (${route})`)
    } else {
      console.log(`❌ Cache MISS: ${testFile} (${route})`)

      testsToRun.push(testFile)
    }

    newCache[testFile] = currentHash
  }

  console.log(`\n📊 Summary:`)
  console.log(`Total tests: ${testFiles.length}`)
  console.log(`Tests to run: ${testsToRun.length}`)
  console.log(`Cached tests: ${testFiles.length - testsToRun.length}`)

  // 변경된 테스트만 실행
  if (testsToRun.length > 0) {
    console.log(`\n🧪 Running ${testsToRun.length} test(s)...`)
    await runTests(testsToRun)
  } else {
    console.log(`\n🎉 All tests are cached! No tests to run.`)
  }

  // 캐시 파일 업데이트
  saveCache(newCache)
  console.log(`\n💾 Cache updated: ${cacheFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
