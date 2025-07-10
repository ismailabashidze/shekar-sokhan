#!/usr/bin/env node
/**
 * این script ورژن را از package.json می‌خواند و در service worker بروزرسانی می‌کند
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔄 Starting version sync process...')

try {
  // خواندن ورژن از package.json
  const packagePath = resolve(__dirname, '../package.json')
  console.log(`📂 Reading package.json from: ${packagePath}`)
  
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
  const version = packageJson.version

  console.log(`📦 Current version: ${version}`)

  // بروزرسانی service worker
  const swPath = resolve(__dirname, '../public/sw.js')
  console.log(`📂 Reading service worker from: ${swPath}`)
  
  let swContent = readFileSync(swPath, 'utf-8')

  // پیدا کردن خط فعلی ورژن
  const currentVersionMatch = swContent.match(/const CACHE_VERSION = '[^']+'/g)
  if (currentVersionMatch) {
    console.log(`🔍 Found current version line: ${currentVersionMatch[0]}`)
  } else {
    console.warn('⚠️ Could not find CACHE_VERSION line')
  }

  // پیدا کردن و جایگزین کردن ورژن
  const versionRegex = /const CACHE_VERSION = '[^']+'/g
  const newVersionLine = `const CACHE_VERSION = 'v${version}'`

  if (swContent.includes('CACHE_VERSION')) {
    console.log(`🔄 Replacing with: ${newVersionLine}`)
    swContent = swContent.replace(versionRegex, newVersionLine)
    writeFileSync(swPath, swContent, 'utf-8')
    console.log(`✅ Service Worker version updated to v${version}`)
  } else {
    console.warn('⚠️ Could not find CACHE_VERSION in service worker')
    console.log('📝 First 10 lines of service worker:')
    const firstLines = swContent.split('\n').slice(0, 10)
    firstLines.forEach((line, i) => {
      console.log(`${i + 1}: ${line}`)
    })
  }

  console.log('🎉 Version sync completed!')

} catch (error) {
  console.error('❌ Error syncing version:', error.message)
  console.error('📍 Stack trace:', error.stack)
  process.exit(1)
} 