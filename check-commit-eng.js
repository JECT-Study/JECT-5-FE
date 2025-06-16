const fs = require("fs")

const commitMessageFile = process.argv[2]
const commitMessage = fs.readFileSync(commitMessageFile, "utf8")

const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

if (koreanRegex.test(commitMessage)) {
  console.error(`
\x1b[31mCommit message contains non-English characters (Korean)\x1b[0m
\x1b[33mPlease write commit messages in English only.\x1b[0m
`)
  process.exit(1) // 커밋 실패
}

process.exit(0) // 통과
