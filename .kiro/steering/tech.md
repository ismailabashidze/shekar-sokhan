# Technology Stack

## Core Framework
- **Nuxt 3.11.2**: Vue.js meta-framework with SSR/SSG capabilities
- **Vue 3**: Frontend framework with Composition API
- **TypeScript**: Primary language for type safety
- **Tairo Template**: Base UI template from cssninjaStudio

## Backend & Database
- **PocketBase**: Backend-as-a-Service with real-time subscriptions
- **Firebase**: Cloud messaging for push notifications
- **ChromaDB**: Vector database for AI embeddings

## AI & ML
- **Anthropic Claude**: AI conversation engine via @anthropic-ai/sdk
- **OpenRouter**: AI model routing and management
- **Gradio Client**: ML model integration

## Styling & UI
- **Tailwind CSS 3.4.3**: Utility-first CSS framework
- **Shuriken UI**: Component library
- **Inter & Karla**: Variable fonts via @fontsource
- **Vazir**: Persian/Farsi font support

## Build Tools & Package Management
- **pnpm**: Package manager (required, not npm/yarn)
- **Vite**: Build tool and dev server
- **ESBuild**: Fast bundling and minification
- **Cross-env**: Environment variable management

## Development Tools
- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting
- **TypeScript**: Type checking (disabled in production builds)
- **Vue TSC**: Vue TypeScript compiler

## PWA & Mobile
- **@vite-pwa/nuxt**: Progressive Web App capabilities
- **Service Workers**: Background notifications and offline support
- **Manifest.json**: App installation metadata

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server on port 4000
pnpm demo:dev              # Start demo version

# Building
pnpm build                 # Production build
pnpm build:fast            # Optimized fast build
pnpm generate              # Static site generation

# Quality Assurance
pnpm test                  # Run all tests
pnpm lint                  # Fix linting issues
pnpm typecheck             # TypeScript checking

# Maintenance
pnpm clean:all             # Clean all node_modules and build artifacts
```

## Environment Requirements
- **Node.js**: >=18 (LTS recommended)
- **pnpm**: >=8 (required, enabled via corepack)
- **Memory**: 6-8GB for builds (configured in build scripts)

## Performance Optimizations
- External heavy dependencies in production builds
- ESBuild for faster compilation
- Payload extraction disabled for speed
- TypeScript checking disabled in production
- Source maps only in development