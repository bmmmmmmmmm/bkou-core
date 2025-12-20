import { build } from 'tsup'
import { glob } from 'glob'
import { runSilent } from '../src/cli/runTask/runHelper.js'
import { parseArgs } from '../src/cli/args/parseArgs.js'
import { createLogKit } from '../src/cli/log/logKit.js'

async function main () {
  const {
    silent: isSilent,
  } = parseArgs(process.argv, {
    flags: {
      S: 'silent',
    },
    defaults: {
      silent: false,
    },
  })

  const Logger = createLogKit({}, null, isSilent ? () => {} : undefined);

  Logger._.loading('starting test build process...')

  // 清理 output_test 目录
  Logger.loading('cleaning output_test directory...')
  await runSilent('rm -rf output_test').promise

  // 查找所有测试文件
  Logger.loading('searching for test files...')
  const testFiles = await glob('src/**/*.test.{ts,js}', {
    ignore: ['**/__tests__/**', '**/__test__/**'],
  })

  if (testFiles.length === 0) {
    Logger.warn('No test files found')
    return
  }

  Logger.info([`Found ${testFiles.length} test files:`, ...testFiles.map(file => `  - ${file}`)])

  // 使用 tsup 编译测试文件
  Logger.loading('building test files...')
  await build({
    entry: testFiles,
    format: ['esm'],
    outDir: 'output_test',
    splitting: true, // 启用代码拆分，共享模块提取到 chunk 文件
    clean: true,
    minify: false, // 测试文件不压缩，便于调试
    sourcemap: true, // 生成 sourcemap
    dts: false, // 测试文件不需要类型声明
    esbuildOptions (options) {
      options.outbase = 'src' // 保持 src/ 下的目录结构
    },
    // silent: isSilent,
    silent: true,
  })

  Logger._.success('test build process completed!')

  Logger.info(['To run individual tests, use commands like:', ...testFiles.map(file => {
    const outputFile = file.replace('src/', 'output_test/').replace(/\.ts$/, '.js')
    return `   node ${outputFile}`
  })])
  Logger.info(['Or run all tests with:', '   node output_test/**/*.test.js'])
}

main().catch(console.error)
