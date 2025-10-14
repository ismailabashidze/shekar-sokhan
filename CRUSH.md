# CRUSH.md - Project Configuration for Agentic Coding Agents

## Build & Development Commands
- `pnpm dev` - Run main app on port 4000
- `pnpm demo:dev` - Run demo app
- `pnpm build` - Build main app for production
- `pnpm demo:build` - Build demo for production
- `pnpm lint` - Run ESLint with auto-fix on all projects
- `pnpm test:tsc-demo` - TypeScript type checking for demo
- `pnpm test:lint` - Run ESLint without fixing
- `pnpm clean:all` - Clean all project artifacts

## Code Style Guidelines

### Environment
- Windows 11 with Git Bash as terminal
- Use `pnpm` as package manager for all operations
- Nuxt 3, TypeScript, Tailwind CSS, Vite stack
- Main app: `.app/`, Demo: `.demo/`, Features: `layers/`

### Import Style
- Use `consistent-type-imports`: prefer `import type` for types
- Type imports should be inline: `import type { MyType } from './module'`
- Auto-imports enabled, disable with `// eslint-disable-next-line no-undef`

### Vue Components
- Use Vue 3 Composition API with `<script setup>`
- Component names can be single word (disable `vue/multi-word-component-names`)
- Setup props destructuring allowed (`vue/no-setup-props-destructure: off`)
- Max 2 attributes per line, 1 for multiline
- Enable `vue/script-setup-uses-vars` and `vue/define-macros-order: error`

### TypeScript Rules
- `no-unused-vars`, `no-undef`, `no-explicit-any`, `ban-ts-comment` disabled (auto-imports)
- Use JSDoc for complex types and documentation

### Formatting
- 2-space indentation, single quotes, no semicolons
- Tailwind CSS class ordering enforced
- `sonarjs` rules disabled for cognitive complexity and duplicates

### Error Handling
- No `console` or `debugger` in production (`error`)
- Allowed in development only
- Use proper TypeScript error boundaries

### Code Principles
- Provide concrete working code, not abstract comments
- Ensure all code blocks properly opened/closed
- Ask for clarification on ambiguous tasks
- Don't work on formatting unless specifically requested