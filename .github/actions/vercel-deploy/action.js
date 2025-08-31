const core = require("@actions/core")
const github = require("@actions/github")

const vercelToken = core.getInput("vercel-token", { required: true })
const githubToken = core.getInput("github-token")
const vercelOrgId = core.getInput("vercel-org-id")
const vercelProjectId = core.getInput("vercel-project-id")
const vercelArgs = core.getInput("vercel-args") || ""

async function run() {
  const octokit = github.getOctokit(githubToken)
  //없을 시 에러
  core.debug(`action : ${github.context.action}`)
  core.debug(`ref : ${github.context.ref}`)
  core.debug(`eventName : ${github.context.eventName}`)
  core.debug(`actor : ${github.context.actor}`)
  core.debug(`sha : ${github.context.sha}`)
  core.debug(`workflow : ${github.context.workflow}`)
  core.exportVariable("VERCEL_ORG_ID", vercelOrgId)
  core.exportVariable("VERCEL_PROJECT_ID", vercelProjectId)

  let { ref } = github.context
  let { sha } = github.context
  let commitOrg = github.context.repo.owner
  let commitRepo = github.context.repo.repo

  console.log("=== BEFORE ANALYSIS ===")
  console.log(`ref: ${ref}`)
  console.log(`sha: ${sha}`)
  console.log(`commitOrg: ${commitOrg}`)
  console.log(`commitRepo: ${commitRepo}`)

  if (github.context.eventName === "push") {
    // push: 기본값 그대로 사용
    core.info("Push event detected")
  } else if (github.context.eventName.startsWith("pull_request")) {
    // PR: head ref/sha 사용
    const pr = github.context.payload.pull_request
    ref = pr.head.ref
    sha = pr.head.sha
    commitOrg = pr.head.repo?.owner.login || github.context.repo.owner
    commitRepo = pr.head.repo?.name || github.context.repo.repo
    core.info(`PR event detected: ${ref}`)
  } else if (github.context.eventName === "release") {
    // Release: tag 사용
    const tagName = github.context.payload.release?.tag_name
    ref = tagName ? `refs/tags/${tagName}` : ref
    core.info(`Release event detected: ${ref}`)
  }

  console.log("=== AFTER ANALYSIS ===")
  console.log(`ref: ${ref}`)
  console.log(`sha: ${sha}`)
  console.log(`commitOrg: ${commitOrg}`)
  console.log(`commitRepo: ${commitRepo}`)

  let deployArgs = vercelArgs.split(" ").filter((arg) => arg.trim())

  console.log("=== BEFORE DEPLOY ARGS ===")
  console.log(`original vercelArgs: "${vercelArgs}"`)
  console.log(`deployArgs: [${deployArgs.join(", ")}]`)

  if (github.context.eventName === "release") {
    // Release: 프로덕션 배포
    if (!deployArgs.includes("--prod")) {
      deployArgs.push("--prod")
    }
    core.info("Release detected: deploying to production")
  } else if (
    github.context.ref === "refs/heads/main" ||
    github.context.ref === "refs/heads/master"
  ) {
    // main/master 브랜치: 프로덕션 배포
    if (!deployArgs.includes("--prod")) {
      deployArgs.push("--prod")
    }
    core.info("Main branch detected: deploying to production")
  } else {
    // 다른 브랜치/PR: preview 배포 (기본값)
    core.info("Feature branch/PR detected: deploying to preview")
  }

  const finalArgs = deployArgs.join(" ")
  console.log("=== FINAL DEPLOY ARGS ===")
  console.log(`deployArgs: [${deployArgs.join(", ")}]`)
  console.log(`finalArgs: "${finalArgs}"`)

  // TODO: 실제 vercel deploy 실행 로직
}

run().catch((error) => {
  core.setFailed(error.message)
})
