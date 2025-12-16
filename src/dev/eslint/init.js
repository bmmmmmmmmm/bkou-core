#!/usr/bin/env node
import { writeFileSync } from 'node:fs'

import { parseArgs } from 'cli/args/parseArgs.js'
import { run } from 'cli/runTask/run'
import { colorLog } from 'cli/log/colorLog'

const config = parseArgs(process.argv, {
  flags: {
    t: 'typescript',
    r: 'react',
  },
  aliases: {
    ts: 'typescript',
    ev: 'version',
  },
  defaults: {
    version: '8',
    typescript: false,
    react: false,
  },
})

colorLog('Configuration:', ['yellow'])
colorLog(`  ESLint: ${config.version === '8' ? 'v8 (Legacy)' : 'v9+ (Flat Config)'}`, ['yellow'])
colorLog(`  TypeScript: ${config.typescript ? '✓' : '✗'}`, ['yellow'])
colorLog(`  React: ${config.react ? '✓' : '✗'}`, ['yellow'])
colorLog('', [])

const useFlat = Number(config.version) >= 9
const configExt = useFlat ? '.flat.mjs' : '.cjs'
const configFileName = useFlat ? 'eslint.config.mjs' : '.eslintrc.cjs'
const useTypescript = config.typescript
const useReact = config.react

if (useFlat) {
  colorLog('Installing ESLint v9...', ['cyan'])
  await run('npm install eslint@9 -D', { io: 'silent' }).promise
  colorLog('ESLint v9 installed.', ['green'])
} else {
  colorLog('Installing ESLint v8...', ['cyan'])
  await run('npm install eslint@8 -D', { io: 'silent' }).promise
  colorLog('ESLint v8 installed.', ['green'])
}

if (useTypescript) {
  colorLog('Installing TypeScript ESLint plugins...', ['cyan'])
  await run('npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin -D', { io: 'silent' }).promise
  colorLog('TypeScript ESLint plugins installed.', ['green'])
}

if (useReact) {
  colorLog('Installing React ESLint plugins...', ['cyan'])
  await run('npm install eslint-plugin-react eslint-plugin-react-hooks -D', { io: 'silent' }).promise
  colorLog('React ESLint plugins installed.', ['green'])
}

const extendsArray = [
  `@bkou/core/dev/eslint/__base__/eslint-config-base${configExt}`,
]
if (useTypescript) {
  extendsArray.push(`@bkou/core/dev/eslint/__typescript__/eslint-config-ts${configExt}`)
}
if (useReact) {
  extendsArray.push(`@bkou/core/dev/eslint/__react__/eslint-config-react${configExt}`)
}

let configContent

if (useFlat) {
  configContent = `
${extendsArray.map((ext, i) => `import config${i + 1} from '${ext}'`).join('\n')}

export default [
${extendsArray.map((_, i) => `  ...config${i + 1},`).join('\n')}
]
`.trim()
} else {
  configContent = `
module.exports = {
  extends: [
${extendsArray.map(ext => `    '${ext}',`).join('\n')}
  ],
}
`.trim()
}

writeFileSync(configFileName, configContent)
colorLog(`✅ ESLint configuration file '${configFileName}' generated successfully!`, ['green'])
