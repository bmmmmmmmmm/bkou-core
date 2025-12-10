import { build } from 'tsup'
import { glob } from 'glob'

async function main () {
  console.log('🧪 开始构建测试文件...\n')

  // 查找所有测试文件
  console.log('🔍 查找测试文件...')
  const testFiles = await glob('src/**/*.test.{ts,js}', {
    ignore: ['**/__tests__/**', '**/__test__/**'],
  })

  if (testFiles.length === 0) {
    console.log('⚠️  没有找到测试文件')
    return
  }

  console.log(`找到 ${testFiles.length} 个测试文件:`)
  testFiles.forEach(file => console.log(`  - ${file}`))
  console.log()

  // 使用 tsup 编译测试文件
  console.log('🔨 编译测试文件...')
  await build({
    entry: testFiles,
    format: ['esm'],
    outDir: 'output_test',
    splitting: true, // 启用代码拆分，共享模块提取到 chunk 文件
    clean: true,
    minify: false, // 测试文件不压缩，便于调试
    sourcemap: true, // 生成 sourcemap
    dts: false, // 测试文件不需要类型声明
  })

  console.log('✅ 测试文件编译完成\n')
  console.log('💡 运行测试:')
  testFiles.forEach(file => {
    const outputFile = file.replace('src/', 'output_test/').replace(/\.ts$/, '.js')
    console.log(`   node ${outputFile}`)
  })
  console.log()
  console.log('💡 或运行所有测试:')
  console.log('   node output_test/**/*.test.js')
}

main().catch(console.error)
