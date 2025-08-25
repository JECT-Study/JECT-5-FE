import crypto from "crypto"
import fs from "fs"
import { glob } from "glob"
import path from "path"
const { spawn } = await import("child_process")

const buildDir = path.join(import.meta.dirname, "../.next")
const cacheFile = path.join(import.meta.dirname, "../test-cache-map.json")

async function findRoutes(pattern: string = "**/*.spec.ts") {
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
      const testProcess = spawn(
        "yarn",
        ["playwright", "test", "--config=playwright.config.ts", ...testFiles],
        {
          stdio: "inherit",
          cwd: import.meta.dirname + "/..",
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
  const { testFiles, routes } = await findRoutes()
  const cache = loadCache()
  const newCache: Record<string, string> = {}
  const testsToRun: string[] = []

  console.log("🔍 Checking test cache...")

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    const testFile = testFiles[i]

    const matchingKey = Object.keys(routeManifest).filter(
      (key) => routeManifest[key] === route,
    )[0]
    const buildFiles = buildManifest["pages"][matchingKey]

    if (buildFiles && Array.isArray(buildFiles)) {
      // 빌드 파일들의 내용을 읽어서 해시 생성
      let combinedContent = ""

      buildFiles.forEach((file) => {
        try {
          const filePath = path.join(buildDir, file)
          const content = fs.readFileSync(filePath, "utf8")
          combinedContent += content
        } catch (error) {
          console.warn(`Warning: Could not read file ${file}:`, error)
        }
      })

      const testFileContent = fs.readFileSync(testFile, "utf8")
      combinedContent += testFileContent

      const currentHash = crypto
        .createHash("sha256")
        .update(combinedContent)
        .digest("hex")

      const cachedHash = cache[testFile]

      if (cachedHash === currentHash) {
        console.log(`✅ Cache HIT: ${testFile} (${route})`)
      } else {
        console.log(`❌ Cache MISS: ${testFile} (${route})`)
        testsToRun.push(testFile)
      }

      // 새 캐시에 현재 해시 저장
      newCache[testFile] = currentHash
    } else {
      console.log(`⚠️  No build files found for route: ${route}`)

      // 빌드 파일이 없어도 테스트 파일 해시는 계산
      try {
        const testFileContent = fs.readFileSync(testFile, "utf8")
        const currentHash = crypto
          .createHash("sha256")
          .update(testFileContent)
          .digest("hex")

        const cachedHash = cache[testFile]

        if (cachedHash === currentHash) {
          console.log(`✅ Cache HIT: ${testFile} (${route}) - test file only`)
        } else {
          console.log(
            `❌ Cache MISS: ${testFile} (${route}) - test file changed`,
          )
          testsToRun.push(testFile)
        }

        newCache[testFile] = currentHash
      } catch (error) {
        console.warn(`Warning: Could not read test file ${testFile}:`, error)
        // 테스트 파일을 읽을 수 없으면 실행
        testsToRun.push(testFile)
      }
    }
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

main().catch(console.error)
