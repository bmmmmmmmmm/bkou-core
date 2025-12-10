import { build } from 'tsup'
import { readFile, writeFile, mkdir, cp } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'
import { minify } from 'terser'
// import { exec } from 'child_process'
// import { promisify } from 'util'

// const execAsync = promisify(exec)

async function main () {
  console.log('🚀 开始构建...\n')

  // 步骤 1: 清理 dist 目录
  // console.log('📦 清理 dist 目录...')
  // await execAsync('rm -rf dist')
  // console.log('✅ 清理完成\n')

  // 步骤 2: 使用 tsup 打包 ts/js 文件
  console.log('🔨 使用 tsup 编译 TypeScript/JavaScript...')
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
  })
  console.log('✅ TypeScript 编译完成\n')

  // 步骤 3: 处理 .cjs 和 .mjs 文件（复制 + 压缩）
  console.log('🔧 处理 .cjs 和 .mjs 文件...')
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
    console.log(`  ✓ ${file} → ${destPath}`)
  }
  console.log('✅ .cjs/.mjs 处理完成\n')

  // 步骤 4: 复制其他文件
  console.log('📦 复制其他文件...')
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
    console.log(`  ✓ ${file} → ${destPath}`)
  }
  if (filesToCopy.length === 0) console.log('  (没有需要复制的文件)')
  console.log('✅ 文件复制完成\n')

  console.log('🎉 构建完成！')
}

main().catch(console.error)
