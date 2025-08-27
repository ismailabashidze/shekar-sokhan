# Zehna Project - Claude Assistant Instructions

## Project Overview
Zehna is a comprehensive mental health and counseling application built with Nuxt.js 3, featuring PWA capabilities, AI-powered therapy sessions, and a full admin management system. The project uses Persian/Farsi language and RTL support throughout.

## Project Structure
This is a monorepo using pnpm workspaces with the following structure:
- **Root**: Main workspace configuration and shared dependencies
- **.app/**: Main application workspace (Nuxt.js app)
- **layers/**: Tairo UI framework layers for different layouts and components

## Version Management Checklist
When updating versions:
1. Update `package.json` (root) 
2. Update `.app/package.json`
3. Update changelog in `.app/pages/changelog.vue`
4. Update `CHANGELOG.md` (if exists)
5. Run version sync script: `pnpm run sync-version`
6. Update PWA service worker version via sync script
7. Update `appVersion` in `.app/nuxt.config.ts` 
8. Commit changes with appropriate version tag

## Key Commands
### Development
```bash
pnpm dev                    # Start development server
pnpm --filter=app dev      # Start app workspace only
```

### Building & Deployment  
```bash
pnpm build                 # Production build
pnpm generate             # Static site generation
pnpm clean:all            # Clean all node_modules and build artifacts
```

### Version Management
```bash
pnpm run sync-version     # Sync version to service worker PWA
```

### Testing & Quality
```bash
pnpm test                 # Run all tests
pnpm lint                 # Run linter with auto-fix
```

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

## Important Files & Directories
- `.app/nuxt.config.ts` - Main Nuxt configuration with appVersion
- `.app/app.config.ts` - App-specific configuration (sidebar, navigation)
- `.app/public/sw.js` - PWA service worker with cache management
- `.app/scripts/sync-version.mjs` - Automatic version synchronization script
- `.app/pages/changelog.vue` - User-facing changelog
- `.app/composables/` - Reusable composition functions
- `layers/tairo/` - Main UI framework layer

## Development Notes
- Uses Persian calendar (Jalaali) for date formatting
- RTL (right-to-left) layout support throughout
- Custom font: IRANSans family in `layers/tairo/fonts/`
- PWA icons generated via script in `.app/scripts/generate-pwa-icons.js`
- Service worker automatically updates cache version on build

## Version Sync Process
The project includes automated version synchronization:
1. Version is read from `.app/package.json`
2. Script updates service worker cache version in `sw.js`
3. AppVersion is exposed via runtime config in Nuxt
4. Components can access version via `useAppVersion()` composable

## Deployment
- Uses PM2 for process management
- Custom deploy script handles build and service restart
- PWA service worker cache is automatically versioned