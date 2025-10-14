import fs from 'node:fs'
import { parse } from '@vue/compiler-dom'

const source = fs.readFileSync('.app/pages/report.vue', 'utf8')
const match = source.match(/<template>([\s\S]*)<\/template>/)

if (!match) {
  console.error('Template block not found')
  process.exit(1)
}

const template = match[1]

try {
  parse(template)
  console.log('Template parsed successfully')
}
catch (error) {
  console.error('Parse error:', error.message)
  if (error.loc)
    console.error('Location:', error.loc)
}
