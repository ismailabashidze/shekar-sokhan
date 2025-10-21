# Zehna - AI-Powered Mental Health & Therapy Management Platform

## Project Overview

This is a comprehensive mental health and therapy management platform built with Nuxt 3, Vue 3, and TypeScript. The application is called "Zehna" (ذهنا) and uses the Tairo template system with Tailwind CSS for styling. It features AI-powered therapy sessions, smart notifications, advanced security, and real-time updates.

## Key Technologies

- **Framework**: Nuxt 3.11.2 (Vue.js-based) with Composition API
- **Styling**: Tailwind CSS 3.4.3
- **Package Manager**: pnpm (monorepo structure)
- **Language**: TypeScript
- **UI Components**: Tairo/Shuriken component system
- **Backend**: PocketBase (realtime subscriptions)
- **AI Engine**: Anthropic Claude via @anthropic-ai/sdk
- **Push Notifications**: Firebase Cloud Messaging
- **Vector Database**: ChromaDB for AI embeddings

## Project Structure

```
front/
├── .app/                  # Main application (port 4000)
├── .demo/                 # Demo application with examples
├── layers/                # Nuxt layers for modular architecture
│   ├── tairo/             # Base Tairo UI framework
│   ├── tairo-layout-sidebar/ # Sidebar layout
│   ├── tairo-layout-topnav/  # Top navigation layout
│   ├── tairo-layout-collapse/ # Collapsible layout
│   └── tairo-layout-iconnav/ # Icon navigation layout
├── guides/                # Documentation and setup guides
├── hooks/                 # PocketBase hooks
├── composables/           # Shared Vue composables
├── plugins/               # Shared Nuxt plugins
├── types/                 # Shared TypeScript definitions
├── fcm-token-server/      # Firebase Cloud Messaging token server
├── functions/             # Firebase Cloud Functions
└── package.json           # Root package configuration (monorepo)
```

## Development Setup

### Enable pnpm with corepack

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Install dependencies

```bash
pnpm install
```

## Building and Running

### Development Server

```bash
pnpm dev
```

> Access the application in your browser at [http://localhost:4000/](http://localhost:4000/)

### Production Build

```bash
pnpm build
```

### Demo Application

```bash
pnpm demo:dev
```

### Fast Production Build

```bash
pnpm --filter=app build:fast
```

## Core Features

### AI-Powered Therapy
- Conversational therapy sessions with "Mana" AI assistant
- Integration with Anthropic Claude API
- Session analysis and emotional mapping

### Smart Notifications
- Firebase-powered push notifications that work when app is closed
- Schedule notifications from minutes to months
- Comprehensive admin controls and monitoring

### Advanced Security
- 5-layer lock system with PIN protection
- User data encryption and privacy controls

### Real-time Updates
- PocketBase realtime subscriptions for instant data sync
- WebSocket connections for live updates

### PWA Support
- Full offline functionality
- Installable as mobile app
- Service worker for background operations

### RTL Support
- Complete Persian/Farsi language support
- Right-to-left UI layout

## Layout Options

1. **Sidebar Layout** (`tairo-layout-sidebar`)
2. **Top Navigation Layout** (`tairo-layout-topnav`)
3. **Icon Navigation Layout** (`tairo-layout-iconnav`)
4. **Collapse Layout** (`tairo-layout-collapse`)

## Tairo Components

### Base Components
- **BaseInput** - Text input fields
- **BaseButton** - Buttons with various styles
- **BaseCard** - Content containers
- **BaseAvatar** - Profile images
- **BaseHeading** - Headings
- **BaseParagraph** - Text paragraphs
- **BaseTag** - Tag elements
- **BaseSelect** - Dropdown selections
- **BaseCheckbox** - Checkbox inputs
- **BaseRadioHeadless** - Radio buttons
- **BaseTextarea** - Multi-line text input
- **BaseListbox** - Custom selects
- **BasePagination** - Pagination controls

### Tairo-Specific Components
- **TairoContentWrapper** - Main content container
- **TairoFlexTable** - Flexible tables
- **TairoModal** - Modal dialogs
- **TairoPopover** - Popover elements
- **TairoTable** - Data tables
- **TairoPanels** - Slide-in panels
- **TairoSidebarLayout** - Sidebar layouts

## Demo Pages

The `.demo` directory contains examples of:
- Form layouts with validation
- Data tables and lists
- Card-based UI elements
- Dashboard components
- Wizard flows
- Authentication screens

## Common Tasks

1. **Use Tairo components**: Import from layers in Vue templates
2. **Customize styling**: Modify Tailwind classes
3. **Add form validation**: Use VeeValidate with Zod schemas
4. **Reference demo examples**: Check `.demo` directory for implementation patterns
5. **Work with AI APIs**: Use composables in `.app/composables/` directory
6. **Manage notifications**: Check `useNotifications` and related composables
7. **Handle real-time data**: Use PocketBase subscriptions via composables

## Useful Resources

- [Tairo Documentation](https://tairo.cssninja.io/documentation)
- [Nuxt.js Documentation](https://nuxt.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PocketBase Documentation](https://pocketbase.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)