import { build } from 'tsup'
import { readFile, writeFile, mkdir, cp } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'
import { minify } from 'terser'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function main () {
  console.log('🚀 开始构建...\n')

  // 步骤 1: 清理 dist 目录
  console.log('📦 清理 dist 目录...')
  await execAsync('rm -rf dist')
  console.log('✅ 清理完成\n')

  // 步骤 2: 使用 tsup 打包 ts/js 文件
  console.log('🔨 使用 tsup 编译 TypeScript/JavaScript...')

  // 找出所有 ts 和 js 文件（排除测试文件）
  const tsFiles = await glob('src/**/*.ts', {
    ignore: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**', '**/__test__/**']
  })
  const jsFiles = await glob('src/**/*.js', {
    ignore: ['**/*.cjs', '**/*.mjs', '**/*.test.js', '**/*.spec.js', '**/__tests__/**', '**/__test__/**']
  })

  // 过滤掉有对应 .ts 文件的 .js 文件
  const jsFilesToBuild = jsFiles.filter(jsFile => {
    const tsFile = jsFile.replace(/\.js$/, '.ts')
    return !tsFiles.includes(tsFile)
  })

  await build({
    entry: [...tsFiles, ...jsFilesToBuild],
    format: ['esm'],
    dts: true,
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
  const moduleFiles = await glob('src/**/*.{cjs,mjs}')

  for (const file of moduleFiles) {
    const destPath = file.replace('src/', 'dist/')
    const destDir = path.dirname(destPath)

    // 创建目录
    await mkdir(destDir, { recursive: true })

    // 读取文件内容
    const code = await readFile(file, 'utf-8')

    // 压缩代码（保留变量名和函数名）
    const result = await minify(code, {
      compress: true,
      mangle: false, // 不混淆变量名
      format: {
        comments: false,
      },
    })

    // 写入压缩后的代码
    await writeFile(destPath, result.code)
    console.log(`  ✓ ${file} → ${destPath}`)
  }
  console.log('✅ .cjs/.mjs 处理完成\n')

  // 步骤 4: 复制所有其他文件（除了已处理的 ts/js/cjs/mjs）
  console.log('📦 复制其他文件...')

  // 获取所有源文件
  const allFiles = await glob('src/**/*', { nodir: true })

  // tsFiles 和 jsFilesToBuild 已经在上面定义过了，直接使用
  const tsFilesSet = new Set(tsFiles)
  const processedJsSet = new Set(jsFilesToBuild)

  // 过滤出需要复制的文件
  const filesToCopy = allFiles.filter(file => {
    const ext = path.extname(file)

    // 排除 .ts 文件（已经被编译了）
    if (ext === '.ts') return false

    // 排除 .cjs 和 .mjs（已经被压缩处理了）
    if (ext === '.cjs' || ext === '.mjs') return false

    // 排除被 tsup 处理过的 .js 文件
    if (ext === '.js' && processedJsSet.has(file)) return false

    // 其他 .js 文件：如果有对应的 .ts 文件，说明是重复的，跳过
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

  if (filesToCopy.length === 0) {
    console.log('  (没有需要复制的文件)')
  }

  console.log('✅ 文件复制完成\n')

  console.log('🎉 构建完成！')
}

main().catch(console.error)
