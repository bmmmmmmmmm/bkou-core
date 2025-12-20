import { build } from 'tsup'
import { readFile, writeFile, mkdir, cp } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'
import { minify } from 'terser'
import { runSilent } from '../src/cli/runTask/runHelper.js'
import { parseArgs } from '../src/cli/args/parseArgs.js'
import { createLogKit } from '../src/cli/log/logKit.js'

async function main () {
  const {
    silent,
    debug: DEBUG,
  } = parseArgs(process.argv, {
    flags: {
      S: 'silent',
      D: 'debug',
    },
    defaults: {
      silent: false,
      debug: false,
    },
  })

  // const write = (text) => process.stdout.write(`${text}\n`)
  // const Logger = createLogKit({}, null, silent ? () => {} : write);
  const Logger = createLogKit({}, null, silent ? () => {} : console.log);

  Logger._.loading('Starting build process...')

  // 步骤 1: 清理 dist 目录
  Logger.loading('Cleaning dist directory...')
  await runSilent('rm -rf dist').promise

  // 步骤 2: 使用 tsup 打包 ts/js 文件
  Logger.loading('Building TypeScript/JavaScript files with tsup...')
  const tsFiles = await glob('src/**/*.ts', {
    ignore: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**', '**/__test__/**'],
  })
  const jsFiles = await glob('src/**/*.js', {
    ignore: ['**/*.cjs', '**/*.mjs', '**/*.test.js', '**/*.spec.js', '**/__tests__/**', '**/__test__/**'],
  })
  const tsFilesToBuild = tsFiles
  const jsFilesToBuild = jsFiles.filter(jsFile => {
    const tsFile = jsFile.replace(/\.js$/, '.ts') // 过滤掉有对应 .ts 文件的 .js 文件
    return !tsFiles.includes(tsFile)
  })
  await build({
    entry: [...tsFilesToBuild, ...jsFilesToBuild],
    format: ['esm'],
    dts: {
      entry: tsFilesToBuild,
    },
    outDir: 'dist',
    splitting: false,
    clean: false,
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: false,
      format: {
        comments: false,
      },
    },
    // silent: silent,
    // silent: !DEBUG,
    silent: true,
  })
  DEBUG && Logger.info([`Built ${tsFilesToBuild.length + jsFilesToBuild.length} TS/JS files:`, ...[...tsFilesToBuild, ...jsFilesToBuild].map(file => `  - ${file}`)])

  // 步骤 3: 处理 .cjs 和 .mjs 文件（复制 + 压缩）
  Logger.loading('Processing .cjs and .mjs files...')
  const moduleFilesToBuild = await glob('src/**/*.{cjs,mjs}')
  for (const file of moduleFilesToBuild) {
    const destPath = file.replace('src/', 'dist/')
    const destDir = path.dirname(destPath)
    await mkdir(destDir, { recursive: true })
    const code = await readFile(file, 'utf-8')
    const result = await minify(code, {
      compress: true,
      mangle: false,
      format: {
        comments: false,
      },
    })
    await writeFile(destPath, result.code)
    // DEBUG && Logger.info(`  ✓ ${file} → ${destPath}`)
  }
  // DEBUG && Logger.info([`Processed ${moduleFilesToBuild.length} .cjs/.mjs files:`, ...moduleFilesToBuild.map(file => `  - ${file}`)])

  // 步骤 4: 复制其他文件
  Logger.loading('Copying other files...')
  const allFiles = await glob('src/**/*', { nodir: true })
  const tsFilesSet = new Set(tsFilesToBuild)
  const jsFilesSet = new Set(jsFilesToBuild)
  const filesToCopy = allFiles.filter(file => {
    const ext = path.extname(file)
    if (file.includes('.test.') || file.includes('.spec.')) return false
    if (ext === '.ts') return false
    if (ext === '.cjs' || ext === '.mjs') return false
    if (ext === '.js' && jsFilesSet.has(file)) return false
    if (ext === '.js') {
      const correspondingTs = file.replace(/\.js$/, '.ts')
      if (tsFilesSet.has(correspondingTs)) return false
    }
    return true
  })
  for (const file of filesToCopy) {
    const destPath = file.replace('src/', 'dist/')
    const destDir = path.dirname(destPath)
    await mkdir(destDir, { recursive: true })
    await cp(file, destPath)
    // DEBUG && Logger.info(`  ✓ ${file} → ${destPath}`)
  }
  DEBUG && Logger.info([`Copied ${filesToCopy.length} other files:`, ...filesToCopy.map(file => `  - ${file}`)])

  Logger._.success('Build process completed!')
}

main().catch(console.error)
