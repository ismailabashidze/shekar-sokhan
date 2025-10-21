#!/usr/bin/env node
/**
 * همگام‌سازی کامل نسخه بین لایه‌های فنی و داده‌های محصولی
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const paths = {
  rootPackage: resolve(__dirname, '../../package.json'),
  appPackage: resolve(__dirname, '../package.json'),
  nuxtConfig: resolve(__dirname, '../nuxt.config.ts'),
  manifest: resolve(__dirname, '../public/manifest.json'),
  serviceWorker: resolve(__dirname, '../public/sw.js'),
  releases: resolve(__dirname, '../../prd/releases.json'),
}

const log = (msg) => console.log(`🔄  ${msg}`)
const warn = (msg) => console.warn(`⚠️  ${msg}`)

const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf-8'))
const writeJson = (filePath, data) => writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)

const updateNuxtConfig = (filePath, version) => {
  let content = readFileSync(filePath, 'utf-8')
  content = content.replace(/let appVersion = '[^']+'/g, `let appVersion = '${version}'`)
  content = content.replace(/packageJson\.version \|\| '[^']+'/g, `packageJson.version || '${version}'`)
  writeFileSync(filePath, content)
}

const updateServiceWorker = (filePath, version) => {
  let content = readFileSync(filePath, 'utf-8')
  if (!content.includes('CACHE_VERSION')) {
    throw new Error('CACHE_VERSION not found in service worker')
  }
  content = content.replace(/const CACHE_VERSION = '[^']+'/g, `const CACHE_VERSION = 'v${version}'`)
  writeFileSync(filePath, content)
}

const validateProductData = (filePath, version) => {
  try {
    const releases = readJson(filePath)
    if (!Array.isArray(releases) || releases.length === 0) {
      warn('prd/releases.json is empty or invalid – skipping validation.')
      return
    }
    const latest = releases[0]
    if (latest.version !== version) {
      warn(`Latest product release (${latest.version}) does not match package version (${version}).`)
    }
  }
  catch (error) {
    warn(`Unable to validate product data: ${error.message}`)
  }
}

try {
  log(`Reading root package.json from ${paths.rootPackage}`)
  const rootPackage = readJson(paths.rootPackage)
  const version = rootPackage.version

  if (!version) {
    throw new Error('Version property is missing in root package.json')
  }

  log(`Using version ${version}`)

  log('Syncing .app/package.json')
  const appPackage = readJson(paths.appPackage)
  if (appPackage.version !== version) {
    appPackage.version = version
    writeJson(paths.appPackage, appPackage)
    log('Updated .app/package.json version')
  }
  else {
    log('App package.json already up to date')
  }

  log('Updating nuxt.config.ts runtime version')
  updateNuxtConfig(paths.nuxtConfig, version)

  log('Updating manifest.json version field')
  const manifest = readJson(paths.manifest)
  if (manifest.version !== version) {
    manifest.version = version
    writeJson(paths.manifest, manifest)
    log('Manifest version updated')
  }
  else {
    log('Manifest version already latest')
  }

  log('Updating service worker cache version')
  updateServiceWorker(paths.serviceWorker, version)

  log('Validating product release data')
  validateProductData(paths.releases, version)

  log('Version sync completed successfully ✅')
}
catch (error) {
  console.error('❌ Error during version sync:', error.message)
  console.error(error.stack)
  process.exit(1)
}