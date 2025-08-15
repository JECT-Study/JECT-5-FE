# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a monorepo using Yarn workspaces with the following structure:

- **service/app**: Next.js 14 application (main frontend)
- **shared/design**: Design system with Storybook and Tailwind CSS
- **shared/lib**: Shared utilities and fetch client
- **shared/eslint**: Shared ESLint configurations
- **shared/figma-plugin**: Figma plugin for extract figma style using mcp
- **shared/types**: Shared TypeScript types

## Development Commands

### Root Level Commands

- `yarn test:all` - Run all tests across workspaces
- `yarn lint:all` - Run linting across all workspaces
- `yarn type-check:all` - Run type checking across all workspaces
- `yarn ci` - Run complete CI pipeline (test, type-check, lint)
- `yarn commit` - Use Commitizen for conventional commits

### App (service/app) Commands

- `yarn workspace @ject-5-fe/app dev` - Start Next.js development server
- `yarn workspace @ject-5-fe/app build` - Build for production
- `yarn workspace @ject-5-fe/app test` - Run unit tests with Vitest
- `yarn workspace @ject-5-fe/app test:msw` - Run MSW integration tests
- `yarn workspace @ject-5-fe/app test:all` - Run all tests (unit + MSW)
- `yarn workspace @ject-5-fe/app test:e2e` - Run Playwright E2E tests
- `yarn workspace @ject-5-fe/app lint` - ESLint with auto-fix
- `yarn workspace @ject-5-fe/app type-check` - TypeScript type checking

### Design System (shared/design) Commands

- `yarn workspace @ject-5-fe/design storybook` - Start Storybook development
- `yarn workspace @ject-5-fe/design test` - Run Storybook tests
- `yarn workspace @ject-5-fe/design generate-icons` - Generate icons from SVG

## Key Architecture Patterns

### Feature-Sliced Design (FSD)

The main app follows FSD architecture:

- **entities/**: Business entities (game, auth) with API, models, and UI
- **widgets/**: Independent UI blocks (GameSection, HeroSection)
- **app/**: Application configuration and routing

### State Management

- **Zustand**: For client-side state management (useGameStore)
- **TanStack Query**: For server state and API caching
- **Context + Reducer**: For complex component state (game creation)

### API & Mocking

- **MSW (Mock Service Worker)**: API mocking for development and testing
- Custom fetch client with interceptors in `shared/lib/fetchClient.ts`
- API functions organized by entity in `entities/*/api/`

### Testing Strategy

- **Vitest**: Unit testing with browser mode using Playwright
- **MSW**: Integration testing with mocked APIs
- **Playwright**: E2E testing (tests in `**/__tests__/**/*.spec.tsx`)
- **Storybook**: Component testing and documentation

## Code Quality & Conventions

### Commit Convention

Uses conventional commits with custom types including "rule" for Cursor Rules changes.

### Linting & Formatting

- Shared ESLint config across workspaces
- Prettier with Tailwind CSS plugin
- Lint-staged for pre-commit hooks

### Testing Files

- Unit tests: `**/*.test.ts`
- E2E tests: `**/__tests__/**/*.spec.tsx`
- MSW tests: Use `vitest.msw.config.ts`
- E2E Test Scenarios: See detailed guidelines in `.cursor/rules/guides/test-spec.mdc`

## Important Development Rules

### File Naming & Structure

- **All file names must be camelCase** (not PascalCase or kebab-case)
- **Component names use PascalCase** (in the code, not file names)
- Follow Feature-Sliced Design architecture with strict layer dependencies
- See detailed conventions in `.cursor/rules/guides/folder-structure-convention.mdc`

### Branch Management & Workflow

- **Main branch**: `main` (deployed version)
- **Development branch**: `dev` (staging)
- **Feature branches**: `feature/*` (created from `dev`)
- Always run `yarn install` when switching branches
- See full process in `.cursor/rules/guides/development-convention.mdc`

### Commit Rules (Enforced by husky)

- **English only** - Korean commits will fail
- Format: `type(scope): description`
- Allowed types: feat, fix, docs, style, refactor, test, chore, ci, build, revert, rule
- Use `yarn commit` for guided conventional commits

### Design System Integration

- Figma design tokens available via MCP integration
- Follow semantic token naming: `color/purpose/detail/state`
- See token conventions in `.cursor/rules/figma/design-token-convention.mdc`

## Environment & Deployment

- **Development**: `yarn dev` (runs on localhost:3000)
- **Figma Integration**: MCP servers configured for Figma plugin and Playwright
- **Build**: Uses Vercel for deployment

## Additional Rules & Guidelines

For comprehensive development guidelines and conventions, refer to the cursor rules in `.cursor/rules/`:

- **Development workflow**: `.cursor/rules/guides/development-convention.mdc`
- **Folder structure**: `.cursor/rules/guides/folder-structure-convention.mdc`
- **Design tokens**: `.cursor/rules/figma/design-token-convention.mdc`
- **MSW usage**: `.cursor/rules/guides/msw-usage-convention.mdc`
- **Playwright E2E testing**: `.cursor/rules/guides/playwright-convention.mdc`
- **Test writing convention**: `.cursor/rules/guides/test-convention.mdc`
- **Test specifications**: `.cursor/rules/guides/test-spec.mdc`
