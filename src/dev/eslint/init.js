#!/usr/bin/env node
import { writeFileSync } from 'node:fs'

import { parseArgs } from '../../cli/args/parseArgs.js'
import { runSilent } from '../../cli/runTask/runHelper.js'
import { Logger } from '../../cli/log/logKit.js'

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

Logger.info([
  'Configuration:',
  `  ESLint: ${config.version === '8' ? 'v8 (Legacy)' : 'v9+ (Flat Config)'}`,
  `  TypeScript: ${config.typescript ? '✓' : '✗'}`,
  `  React: ${config.react ? '✓' : '✗'}`,
  '',
])

const useFlat = Number(config.version) >= 9
const configExt = useFlat ? '.flat.mjs' : '.cjs'
const configFileName = useFlat ? 'eslint.config.mjs' : '.eslintrc.cjs'
const useTypescript = config.typescript
const useReact = config.react

if (useFlat) {
  Logger.loading('Installing ESLint v9...')
  await runSilent('npm install eslint@9 -D')
  // Logger.success('ESLint v9 installed.')
} else {
  Logger.loading('Installing ESLint v8...')
  await runSilent('npm install eslint@8 -D')
  // Logger.success('ESLint v8 installed.')
}

Logger.loading('Installing base ESLint plugins...')
await runSilent('npm install eslint-plugin-import eslint-plugin-n eslint-plugin-promise -D')
// Logger.success('Base ESLint plugins installed.')

if (useTypescript) {
  Logger.loading('Installing TypeScript ESLint plugins...')
  await runSilent('npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin -D')
  // Logger.success('TypeScript ESLint plugins installed.')
}

if (useReact) {
  Logger.loading('Installing React ESLint plugins...')
  await runSilent('npm install eslint-plugin-react eslint-plugin-react-hooks -D')
  // Logger.success('React ESLint plugins installed.')
}

const extendsArray = [
  `./node_modules/@bkou/core/dist/dev/eslint/__base__/eslint-config-base${configExt}`,
]
if (useTypescript) {
  extendsArray.push(`./node_modules/@bkou/core/dist/dev/eslint/__typescript__/eslint-config-ts${configExt}`)
}
if (useReact) {
  extendsArray.push(`./node_modules/@bkou/core/dist/dev/eslint/__react__/eslint-config-react${configExt}`)
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

writeFileSync(configFileName, configContent + '\n')

Logger.success(`ESLint initialized and '${configFileName}' generated successfully!`)
