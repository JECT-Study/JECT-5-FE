# Repository Guidelines

## Project Structure & Module Organization

- `service/app`: Next.js application; UI routes live in `src/app`, and feature logic under `src/entities`. Co-locate Vitest specs in feature folders and Playwright specs in `src/app/__tests__`.
- `shared/design`: Reusable component library with Storybook support (`src/components`, `src/icons`). Use this package for UI primitives instead of redefining widgets in the app workspace.
- `shared/lib` & `shared/types`: Fetch client utilities, response helpers, and shared type definitions consumed by both workspaces.
- `scripts/`: Automation helpers (e.g., Playwright cache runner) and repo-wide tooling. Check here before duplicating command wrappers.

## Build, Test, and Development Commands

- `yarn workspace @ject-5-fe/app dev`: Start the Next.js dev server with hot reload.
- `yarn workspace @ject-5-fe/app build` / `start`: Produce and serve the production bundle.
- `yarn workspace @ject-5-fe/app test:all`: Run Vitest unit tests plus MSW-backed suites.
- `yarn workspace @ject-5-fe/app test:e2e`: Execute Playwright end-to-end scenarios.
- `yarn workspace @ject-5-fe/design dev`: Launch the design system Vite playground; use `storybook` to review component stories.
- `yarn lint:all`, `yarn type-check:all`, `yarn ci`: Project-wide quality gates configured for CI parity.

## Coding Style & Naming Conventions

- TypeScript with ES modules; keep files lower-case kebab or camel per existing folder conventions (`gameLibraryGrid.tsx`).
- 2-space indentation, Prettier formatting (`yarn workspace <pkg> format`) and ESLint (`lint` scripts) are enforced via lint-staged.
- Favor explicit domain names (`GameCardOptions`, `useInfiniteMyGames`) and colocate UI, API, and hooks within each `entities/<domain>` module.
- Tailwind CSS utilities are ordered via the Prettier Tailwind plugin; avoid inline style objects unless necessary.

## Testing Guidelines

- Unit and integration tests use Vitest; place specs adjacent to code or within `__tests__` directories with `.spec.ts(x)` suffix.
- Playwright powers smoke and regression flows; keep scenarios idempotent and reusable across environments.
- Mock network calls with MSW when running `test:msw`; rely on `fetchClient` interceptors for auth/session coverage.

## Commit & Pull Request Guidelines

- Follow Conventional Commits; allowed types include `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `revert`, and `rule` (see `commitlint.config.js`). Use `yarn commit` to launch Commitizen if unsure.
- Scope commits to logical units with passing tests. Document UI changes with screenshots or recordings when feasible.
- Pull requests should summarize intent, note affected packages (`@ject-5-fe/app`, `@ject-5-fe/design`, etc.), link tracking issues, and mention required follow-up tasks to help reviewers.

## Cursor Rule References

- Review `.cursor/rules/guides` for project conventions (development, testing, Playwright, MSW usage, structure). Align automation or agent actions with these documents before adding new workflows.
- Follow `.cursor/rules/figma` when syncing design tokens or transforming Figma assets; these rules define naming and usage expectations for shared UI resources.

## plan and act mode

You have two modes of operation:

1. Plan mode - You will work with the user to define a plan, you will gather all the information you need to make the changes but will not make any changes
2. Act mode - You will make changes to the codebase based on the plan

- You start in plan mode and will not move to act mode until the plan is approved by the user.
- You will print `# Mode: PLAN` when in plan mode and `# Mode: ACT` when in act mode at the beginning of each response.
- Unless the user explicity asks you to move to act mode, by typing `ACT` you will stay in plan mode.
- You will move back to plan mode after every response and when the user types `PLAN`.
- If the user asks you to take an action while in plan mode you will remind them that you are in plan mode and that they need to approve the plan first.
- When in plan mode always output the full updated plan in every response.
