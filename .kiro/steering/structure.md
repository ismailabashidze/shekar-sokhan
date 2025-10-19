# Project Structure

## Workspace Organization

This is a **pnpm monorepo** with multiple packages defined in `pnpm-workspace.yaml`:

```
├── .app/          # Main application (primary development target)
├── .demo/         # Demo/documentation application  
├── layers/        # Nuxt layers for modular architecture
└── root/          # Workspace root with shared configs
```

## Main Application (.app/)

The primary application lives in `.app/` directory:

```
.app/
├── assets/        # Static assets (CSS, images, fonts)
├── components/    # Vue components
├── composables/   # Vue composables and utilities
├── layouts/       # Nuxt layout components
├── middleware/    # Route middleware
├── pages/         # File-based routing pages
├── plugins/       # Nuxt plugins (Firebase, etc.)
├── public/        # Public static files
├── server/        # Server-side API routes
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Nuxt Layers Architecture

The project uses **Nuxt layers** for modular architecture:

- `layers/tairo/` - Base Tairo UI framework
- `layers/tairo-layout-sidebar/` - Sidebar layout implementation
- `layers/tairo-layout-topnav/` - Top navigation layout
- `layers/tairo-layout-collapse/` - Collapsible layout
- `layers/tairo-layout-iconnav/` - Icon navigation layout

## Key Directories

### Root Level
- `guides/` - Documentation and setup guides
- `fcm-token-server/` - Firebase Cloud Messaging token server
- `functions/` - Firebase Cloud Functions
- `hooks/` - PocketBase hooks
- `composables/` - Shared composables (notifications, etc.)
- `plugins/` - Shared plugins (Firebase client)
- `types/` - Shared TypeScript definitions

### Configuration Files
- `.app/nuxt.config.ts` - Main Nuxt configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.eslintrc.cjs` - ESLint configuration with Vue/TS rules
- `pnpm-workspace.yaml` - Monorepo workspace definition

## File Naming Conventions

### Components
- Use PascalCase: `MyComponent.vue`
- Multi-word component names required
- Place in appropriate subdirectories by feature

### Pages & Layouts
- Use kebab-case for file names: `user-profile.vue`
- Nested routes via folder structure: `users/[id].vue`

### Composables
- Prefix with `use`: `useNotifications.ts`
- Export default function with same name

### Types
- Use PascalCase for interfaces: `UserProfile`
- Suffix with appropriate type: `ApiResponse`, `FormData`

## Import Conventions

### Auto-imports Enabled
- Components auto-imported from `components/`
- Composables auto-imported from `composables/`
- Utils auto-imported from `utils/`

### Type Imports
- Use inline type imports: `import { type User } from '~/types'`
- Enforced by ESLint rule `@typescript-eslint/consistent-type-imports`

## Development Workflow

### Primary Commands
- Work in `.app/` directory for main development
- Use `pnpm dev` from root to start development server
- Server runs on port 4000 by default

### Code Quality
- ESLint with Vue 3, TypeScript, and Tailwind rules
- Automatic formatting on save
- Pre-commit hooks via lint-staged

## Special Directories

### .kiro/
- Kiro-specific configuration and steering files
- `steering/` - AI assistant guidance documents

### Firebase Integration
- `plugins/firebase.client.ts` - Firebase initialization
- `public/firebase-messaging-sw.js` - Service worker for notifications
- `fcm-token-server/` - Standalone token server

### PocketBase Integration
- `hooks/` - Server-side PocketBase hooks
- Real-time subscriptions handled in composables

## Environment Configuration

### Development
- Environment variables in `.app/.env`
- Firebase config via runtime config
- PocketBase connection settings

### Production
- Build output in `.app/dist/`
- Optimized for Netlify deployment
- Service worker for PWA functionality