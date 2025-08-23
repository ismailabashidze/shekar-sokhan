# Zehna Project - Qwen Code Context

## Project Overview

Zehna is a comprehensive mental health and counseling application built with Nuxt.js 3. It features Progressive Web App (PWA) capabilities, AI-powered therapy sessions, and a full admin management system. The project uses Persian/Farsi language and right-to-left (RTL) layout support throughout.

## Project Structure

This is a monorepo using pnpm workspaces with the following structure:

- **Root**: Main workspace configuration and shared dependencies
- **.app/**: Main application workspace (Nuxt.js app)
- **.demo/**: Demo application workspace
- **layers/**: Tairo UI framework layers for different layouts and components
- **hooks/**: Git hooks configuration
- **patches/**: Patch files for dependencies

## Technology Stack

- **Framework**: Nuxt.js 3.11.2
- **UI**: Tairo UI framework (custom layers)
- **Database**: PocketBase
- **PWA**: Custom service worker + manifest
- **Styling**: TailwindCSS with custom Tairo components
- **Language**: TypeScript
- **Package Manager**: pnpm 9.1.4+
- **AI Integration**: Anthropic Claude, OpenRouter for sentiment analysis
- **State Management**: Composables-based approach

## Key Features

- Progressive Web App (PWA) with offline support
- AI-powered therapy sessions with sentiment analysis
- Admin notification system with push notifications
- Persian/Farsi language support with RTL layout
- Tour system for user onboarding (Driver.js)
- Version display and changelog system
- Comprehensive user management and analytics
- Payment system integration

## Building and Running

### Prerequisites

1. A recent web browser (Chrome, Edge, Firefox, ...)
2. [Node.js LTS](https://nodejs.org/en/) (>=18) installed
3. Knowledge with [Typescript](https://github.com/microsoft/typescript)
4. Knowledge with [Tailwind CSS](https://tailwindcss.com/)
5. (recommended) [VSCode](https://code.visualstudio.com/) with [Volar](https://marketplace.visualstudio.com/items?itemName=vue.volar)

### Setup

1. Enable pnpm with corepack:
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:
```bash
pnpm dev
```
Access the application in your browser at [http://localhost:3000/](http://localhost:3000/)

### Building for Production

To build the application for production:
```bash
pnpm build
```

To generate a static site:
```bash
pnpm generate
```

### Testing & Quality

Run linter with auto-fix:
```bash
pnpm lint
```

Run all tests:
```bash
pnpm test
```

Clean all node_modules and build artifacts:
```bash
pnpm clean:all
```

## Development Conventions

### Version Management

When updating versions:
1. Update `package.json` (root)
2. Update `.app/package.json`
3. Update changelog in `.app/pages/changelog.vue`
4. Update `CHANGELOG.md` (if exists)
5. Run version sync script: `pnpm run sync-version`
6. Update PWA service worker version via sync script
7. Update `appVersion` in `.app/nuxt.config.ts`
8. Commit changes with appropriate version tag

### Code Structure

- Uses Persian calendar (Jalaali) for date formatting
- RTL (right-to-left) layout support throughout
- Custom font: IRANSans family in `layers/tairo/fonts/`
- PWA icons generated via script in `.app/scripts/generate-pwa-icons.js`
- Service worker automatically updates cache version on build

### Key Files & Directories

- `.app/nuxt.config.ts` - Main Nuxt configuration with appVersion
- `.app/app.config.ts` - App-specific configuration (sidebar, navigation)
- `.app/public/sw.js` - PWA service worker with cache management
- `.app/scripts/sync-version.mjs` - Automatic version synchronization script
- `.app/pages/changelog.vue` - User-facing changelog
- `.app/composables/` - Reusable composition functions
- `layers/tairo/` - Main UI framework layer

## Important Commands Summary

| Command              | Description                           |
|----------------------|---------------------------------------|
| `pnpm install`       | Install all dependencies              |
| `pnpm dev`           | Start development server              |
| `pnpm build`         | Production build                      |
| `pnpm generate`      | Static site generation                |
| `pnpm lint`          | Run linter with auto-fix              |
| `pnpm test`          | Run all tests                         |
| `pnpm clean:all`     | Clean all node_modules and artifacts  |
| `pnpm run sync-version` | Sync version to service worker PWA |
