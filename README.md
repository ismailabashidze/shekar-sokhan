# Zehna - Mental Health & Therapy Platform

[![Nuxt](https://img.shields.io/badge/Nuxt-3.11.2-00DC82?logo=nuxt.js)](https://nuxt.com)
[![Firebase](https://img.shields.io/badge/Firebase-FCM-FFCA28?logo=firebase)](https://firebase.google.com)
[![PocketBase](https://img.shields.io/badge/PocketBase-Backend-B8DBE4)](https://pocketbase.io)

## 🎯 Overview

Zehna (ذهنا) is a comprehensive mental health and therapy management platform built with Nuxt 3. It features AI-powered therapy sessions, real-time notifications, and advanced scheduling capabilities.

### Key Features

- 🤖 **AI-Powered Therapy** - Intelligent conversational therapy with Mana
- 🔔 **Smart Notifications** - Firebase-powered push notifications (works when app is closed!)
- 📅 **Flexible Scheduling** - Schedule notifications from minutes to months
- 🔐 **Advanced Security** - 5-layer lock system with PIN protection
- 📊 **Session Analysis** - Comprehensive AI analysis of therapy sessions
- 💬 **Real-time Updates** - PocketBase realtime subscriptions
- 📱 **PWA Support** - Full offline functionality and installable
- 🌙 **RTL Support** - Complete Persian/Farsi language support

## 📬 Notification System

This project includes a **production-ready notification system** that sends push notifications even when the app is closed. Perfect for:

- ✅ Sending analysis results (5 staged notifications)
- ✅ Reminding inactive users (customizable intervals)
- ✅ Session follow-ups and check-ins
- ✅ Scheduled announcements

**Key Benefits:**
- Works when app is completely closed ✨
- Flexible timing (1 minute to 1 month+)
- No code changes needed to adjust timing
- Free tier supports millions of notifications
- Admin panel for easy configuration

**Quick Setup:** See [NOTIFICATIONS_QUICKSTART.md](NOTIFICATIONS_QUICKSTART.md) for 30-minute setup guide.

## ▶️ Getting started

Thank you for using Zehna! This platform is built on the **Tairo** template from [cssninjaStudio](https://cssninja.io/).

### Prerequisites

1. A recent web browser (Chrome, Edge, Firefox, ...)
2. [Node.js LTS](https://nodejs.org/en/) _(LTS or Current version)_ installed
3. Knowledge with [Typescript](https://github.com/microsoft/typescript) _(should not be installed globally)_
4. Knowledge with [Tailwind CSS](https://tailwindcss.com/)
5. (recommended) [VSCode](https://code.visualstudio.com/) with [Volar](https://marketplace.visualstudio.com/items?itemName=vue.volar)

#### Install Node.js

1. Check if you already have Node.js installed. Run this command in your terminal:

```bash
node -v
```

If node is not installed on your machine, you can go to the official nodejs.org website, and choose the version depending on your operating system:

- <a href="https://nodejs.org/en/download/" target="_blank">Install Node.js and npm on Windows, Linux or Mac OSX</a>
- <a href="https://github.com/nvm-sh/nvm" target="_blank">Or, install Node Version Manager to quickly install and use different versions of Node.js</a>

2. Enable pnpm with corepack

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

> _corepack is installed with node from **v16.13.x**, if your version is below, install it with: `npm install -g corepack`_

To setup the template and start installing project dependencies, run:

```bash
pnpm install
```

> **Note:** This will install depenencies form all packages that matches with `pnpm-workspace.yaml`. If you need to clear all `node_modules`, you can use `pnpm clear:all` command.

## 🔃 Run a development server

To start the development server, run:

```bash
pnpm dev
```

This will run the `dev` script from the `package.json` file.

> Access the Tairo frontend in your browser at [http://localhost:4000/](http://localhost:4000/)

## 📚 Documentation

### Notification System
- **[Quick Start Guide](NOTIFICATIONS_QUICKSTART.md)** - Get notifications working in 30 minutes
- **[Firebase Setup](FIREBASE_SETUP.md)** - Complete Firebase Cloud Messaging setup
- **[Scheduling Guide](NOTIFICATION_SCHEDULING.md)** - How to configure flexible timing

### System Documentation
- **[Lock System](LOCK_SYSTEM_IMPLEMENTATION.md)** - Security and PIN protection
- **[Agents Guide](AGENTS.md)** - AI assistant instructions
- **[Version Updates](CLAUDE.md)** - Version update checklist

### External Resources
- [Tairo Documentation](https://tairo.cssninja.io/documentation)
- [Shuriken UI Documentation](https://shurikenui.com)
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PocketBase Documentation](https://pocketbase.io/docs)

## 🚀 Deployment

The app is configured for deployment on Netlify with the following setup:

```bash
# Build command
pnpm run build

# Publish directory
.app/dist

# Environment variables required
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=your_project
FIREBASE_VAPID_KEY=your_vapid_key
# ... (see .env.example)
```

## 🤝 Contributing

1. Follow the coding standards (ESLint + Prettier)
2. Test notification system thoroughly
3. Update documentation for new features
4. Maintain Persian language support (RTL)

## 📄 License

This project is built on Tairo template. Please refer to your Tairo license for usage terms.
