# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev                    # Start development server (opens at localhost:3000)
pnpm demo:dev              # Start demo development server
```

### Building
```bash
pnpm build                 # Production build
pnpm build:fast            # Fast production build with optimizations
pnpm generate              # Generate static site
```

### Testing & Quality
```bash
pnpm test                  # Run all tests
pnpm test:tsc-demo         # TypeScript type checking for demo
pnpm test:lint             # ESLint linting
pnpm lint                  # Fix linting issues
pnpm typecheck             # Type checking (.app workspace)
```

### Utilities
```bash
pnpm clean:all             # Clean all node_modules and build artifacts
pnpm generate-pwa-icons    # Generate PWA icons
```

## Project Architecture

### Monorepo Structure
This is a pnpm workspace with three main packages:
- **`.app/`** - Main application (production app)
- **`.demo/`** - Demo application for showcasing features
- **`layers/`** - Nuxt layers providing reusable functionality

### Key Layers
- **`layers/tairo/`** - Core Tairo layer with base components and utilities
- **`layers/tairo-layout-sidebar/`** - Sidebar layout implementation
- **`layers/tairo-layout-collapse/`** - Collapsible layout
- **`layers/tairo-layout-iconnav/`** - Icon navigation layout
- **`layers/tairo-layout-topnav/`** - Top navigation layout
- **`layers/documentation/`** - Documentation system
- **`layers/landing/`** - Landing page components

### Technology Stack
- **Frontend:** Nuxt 3, Vue 3, TypeScript
- **Styling:** Tailwind CSS, Shuriken UI components
- **AI/ML:** Anthropic Claude SDK, ChromaDB for vector storage
- **Backend:** PocketBase, Gradio client
- **PWA:** Vite PWA plugin with offline support
- **Rich Text:** Quill editor with Vue integration

### Application Structure (.app)
- **`pages/`** - File-based routing with nested routes
- **`components/`** - Vue components organized by feature
- **`server/api/`** - Server-side API routes
- **`layouts/`** - Layout components
- **`middleware/`** - Route middleware
- **`composables/`** - Vue composables for shared logic

### Key Features
- **Persian language support** with RTL layout
- **PWA capabilities** with offline support and push notifications
- **AI-powered therapy sessions** using Claude API
- **Vector database integration** with ChromaDB
- **Rich text editing** with Quill
- **Payment integration** with Dargah
- **Multi-layout system** (sidebar, topnav, collapse, iconnav)

### Configuration
- **`app.config.ts`** - Application configuration including sidebar navigation
- **`nuxt.config.ts`** - Nuxt configuration with layer extends
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration

### Development Notes
- Uses pnpm for package management
- Extends Shuriken UI for base components
- Implements custom Persian calendar component
- Heavy dependencies (ChromaDB, Anthropic SDK) are externalized in production builds
- TypeScript strict mode disabled for faster development builds
- Uses ESLint with Vue, TypeScript, and Tailwind plugins

### Build Optimizations
- Production builds use esbuild for faster compilation
- Heavy server-side dependencies (ChromaDB, Anthropic SDK, Gradio) are externalized to prevent client bundling
- Source maps only generated in development
- PWA features configured with manifest.json and service worker
- Custom build scripts handle version syncing and PWA icon generation

## UI Improvements
- Add a proper spacing for Tairo Modals and their buttons.

## Version Management
- For version updates, follow these steps:
  - Update `package.json` with the new version number
  - Update `changelog.vue` to document changes
  - Update `changelog.md` with release notes
  - Build the project with `pnpm build`
  - properly update cache and pwa manager versions, config.public, config.public?.appVersion