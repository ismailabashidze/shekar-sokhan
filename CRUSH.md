# CRUSH.md - Project Configuration for Agentic Coding Agents

## Project Overview

This is a **multi-layered Nuxt 3 application** with the following structure:
- **Main App** (`.app/`): Production application with Persian language support, RTL layout, and PWA features
- **Demo App** (`.demo/`): Full-featured demo showcasing Tairo theme components and layouts
- **Layers** (`layers/`): Modular architecture with shared components and layouts
  - `tairo`: Core Tairo theme layer with base components
  - `tairo-layout-*`: Layout variations (sidebar, topnav, iconnav, collapse)
  - `landing`: Landing page components
  - `documentation`: Component documentation system

## Development Environment

**Important**: Development server runs on port 4000 (`http://127.0.0.1:4000`). Do NOT run any PNPM commands unless explicitly requested - a dev server is always running in the background.

### Technology Stack
- **Framework**: Nuxt 3.11.2 with TypeScript
- **Styling**: Tailwind CSS with custom RTL support
- **UI Components**: Tairo theme (built on Shuriken UI)
- **Build**: Vite with PWA support
- **Package Manager**: pnpm (workspace monorepo)

### Key Features
- **RTL Support**: Persian/Farsi language with right-to-left layout
- **PWA**: Service worker, install prompts, offline capabilities
- **Multi-layout**: Sidebar, topnav, iconnav, collapse layouts
- **Authentication**: User system with lock functionality
- **AI Integration**: OpenRouter, OpenAI, Anthropic, and local LLM support
- **Database**: PocketBase integration
- **Advanced Features**: Tour system, emotion analysis, chat interfaces

## Project Structure

```
front/
├── .app/                    # Main production app
│   ├── pages/              # App pages (dashboard, auth, etc.)
│   ├── components/         # App-specific components
│   ├── composables/        # Vue composables
│   ├── server/api/        # API routes
│   └── nuxt.config.ts      # App configuration
├── .demo/                  # Demo app for Tairo theme
│   ├── pages/              # Demo pages
│   ├── components/         # Demo-specific components
│   └── nuxt.config.ts      # Demo configuration
├── layers/                 # Nuxt layers (modular architecture)
│   ├── tairo/              # Core theme layer
│   ├── tairo-layout-*/     # Layout variations
│   ├── landing/            # Landing page layer
│   └── documentation/      # Documentation layer
└── package.json            # Workspace configuration
```

## Build & Development Commands

**DO NOT RUN THESE UNLESS EXPLICITLY REQUESTED**

```bash
# Main app commands
pnpm dev                    # Run main app on port 4000
pnpm build                  # Build main app for production

# Demo app commands  
pnpm demo:dev              # Run demo app
pnpm demo:build            # Build demo for production

# Linting and testing
pnpm lint                  # Run ESLint with auto-fix on all projects
pnpm test:lint             # Run ESLint without fixing
pnpm test:tsc-demo         # TypeScript type checking for demo

# Cleanup
pnpm clean:all             # Clean all project artifacts
```

## Code Style Guidelines

### Import Style
- Auto-imports enabled (Vue composables, utilities, etc.)
- Use inline type imports: `import type { MyType } from './module'`
- Auto-imports recognized by ESLint (no-undef disabled)

### Vue Components
- Use Vue 3 Composition API with `<script setup>`
- Component names can be single word (`vue/multi-word-component-names: off`)
- Setup props destructuring allowed (`vue/no-setup-props-destructure: off`)
- Max 2 attributes per line, 1 for multiline
- Enable `vue/script-setup-uses-vars` and `vue/define-macros-order: error`

### TypeScript Rules
- Disabled due to auto-imports: `no-unused-vars`, `no-undef`, `no-explicit-any`, `ban-ts-comment`
- Use JSDoc for complex types and documentation
- Type checking disabled in production builds for speed

### Formatting
- 2-space indentation, single quotes, no semicolons
- Tailwind CSS class ordering enforced (`tailwindcss/classnames-order: error`)
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

## Special Considerations

### Multi-Layer Architecture
- This is a **Nuxt Layers** project (not standard monorepo)
- Each layer extends others through `extends` in `nuxt.config.ts`
- Components from layers are automatically available
- Layout layers can be mixed and matched

### RTL/Persian Support
- HTML direction set to RTL (`htmlAttrs: { dir: 'rtl' }`)
- Persian fonts (IRANSansWeb family) loaded
- Tailwind CSS configured for RTL
- Most UI components have RTL variants

### PWA Features
- Service worker for offline functionality
- App install prompts
- Custom manifest with Persian app name
- Debug components for PWA development

### AI/LLM Integration
- Multiple AI providers supported (OpenRouter, OpenAI, Anthropic)
- Server-side API routes for AI interactions
- Emotion analysis and chat interfaces
- Local LLM support with chunking systems
