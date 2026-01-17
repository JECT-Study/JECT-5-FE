# Claude Command: Commit

This command helps you create well-formatted commits with conventional commit messages.

## Usage

To create a commit, just type:

```
/commit
```

Or with options:

```
/commit --no-verify
```

## What This Command Does

2. Checks which files are staged with `git status`
3. If 0 files are staged, automatically adds all modified and new files with `git add`
4. Performs a `git diff` to understand what changes are being committed
5. Analyzes the diff to determine if multiple distinct logical changes are present
6. If multiple distinct changes are detected, suggests breaking the commit into multiple smaller commits
7. For each commit (or the single commit if not split), creates a commit message using conventional commit format

## Best Practices for Commits

- **Verify before committing**: Ensure code is linted, builds correctly, and documentation is updated
- **Atomic commits**: Each commit should contain related changes that serve a single purpose
- **Split large changes**: If changes touch multiple concerns, split them into separate commits
- **Conventional commit format**: Use the format `<type>: <description>` or `<type>(scope): <description>` where type is one of:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation changes
  - `style`: Code style changes (formatting, etc)
  - `refactor`: Code changes that neither fix bugs nor add features
  - `test`: Adding or fixing tests
  - `chore`: Changes to the build process, tools, etc.
  - `ci`: CI/CD related changes
  - `build`: Build system or external dependency changes
  - `revert`: Reverting a previous commit
  - `ai`: AI agent related changes (rules, skills, etc.)
- **Present tense, imperative mood**: Write commit messages as commands (e.g., "add feature" not "added feature")
- **Concise first line**: Keep the first line under 72 characters
- **No emoji**: Do not use emoji in commit messages

## Guidelines for Splitting Commits

When analyzing the diff, consider splitting commits based on these criteria:

1. **Different concerns**: Changes to unrelated parts of the codebase
2. **Different types of changes**: Mixing features, fixes, refactoring, etc.
3. **File patterns**: Changes to different types of files (e.g., source code vs documentation)
4. **Logical grouping**: Changes that would be easier to understand or review separately
5. **Size**: Very large changes that would be clearer if broken down

## Examples

Good commit messages (single line):

- feat: add user authentication system
- fix: resolve memory leak in rendering process
- feat(auth): add OAuth2 login support
- fix(api): handle null response from server

Good commit messages with body (use '-' bullet points):

```
refactor(design): separate corner radius extraction from stroke pipeline

- Extract corner radius logic into dedicated CornerExtractor class
- Create CornerNormalizer for corner normalization
- Promote corner to top-level style property
- Fix paint-level alias to only apply to solid paints
```

- docs: update API documentation with new endpoints
- refactor: simplify error handling logic in parser
- chore: improve developer tooling setup process
- style: reorganize component structure for better readability
- ci: add GitHub Actions workflow for testing
- build: upgrade webpack to v5
- revert: undo breaking change in user service
- ai: add claude command for commit automation

Example of splitting commits:

- First commit: feat: add new solc version type definitions
- Second commit: docs: update documentation for new solc versions
- Third commit: chore: update package.json dependencies
- Fourth commit: test: add unit tests for new solc version features
- Fifth commit: fix: update dependencies with security vulnerabilities

## Command Options

- `--no-verify`: Skip running the pre-commit checks (lint, build, generate:docs)

## Important Notes

- **lint-staged runs automatically**: When committing, lint-staged will run linting and formatting checks on staged files
- **If lint-staged fails, the commit will be rejected**: You cannot proceed with the commit until the issues are fixed
- **On failure, immediately explain the cause**: If the commit fails due to lint-staged, analyze the error output and explain what went wrong and how to fix it
- If specific files are already staged, the command will only commit those files
- If no files are staged, it will automatically stage all modified and new files
- The commit message will be constructed based on the changes detected
- Before committing, the command will review the diff to identify if multiple commits would be more appropriate
- If suggesting multiple commits, it will help you stage and commit the changes separately
- Always reviews the commit diff to ensure the message matches the changes
