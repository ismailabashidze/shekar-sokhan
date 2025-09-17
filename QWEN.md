# Tairo Nuxt - Multipurpose Admin and Webapp Tailwind Template

## Project Overview

This is a Nuxt.js-based multipurpose admin and web application template built with Tailwind CSS. The project is called "ذهنا" (Zehna) and uses the Tairo template system.

## Key Technologies

- **Framework**: Nuxt.js (Vue.js-based)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Language**: TypeScript
- **UI Components**: Tairo component system

## Project Structure

```
front/
├── .app/                 # Main application
├── layers/               # Tairo layers
│   ├── tairo/            # Base Tairo layer
│   ├── tairo-layout-sidebar/ # Sidebar layout
│   └── ...               # Other layout layers
├── .demo/                # Demo application with examples
└── package.json          # Root package configuration
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

> Access the application in your browser at [http://localhost:3000/](http://localhost:3000/)

### Demo Application

```bash
pnpm demo:dev
```

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

## Layout Options

1. **Sidebar Layout** (`tairo-layout-sidebar`)
2. **Top Navigation Layout** (`tairo-layout-topnav`)
3. **Icon Navigation Layout** (`tairo-layout-iconnav`)
4. **Collapse Layout** (`tairo-layout-collapse`)

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

## Useful Resources

- [Tairo Documentation](https://tairo.cssninja.io/documentation)
- [Nuxt.js Documentation](https://nuxt.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)