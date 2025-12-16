import { colorLog } from 'log/colorLog.js'

// ========== parseArgs() 函数测试 ==========
import { parseArgs } from './parseArgs.js'

colorLog('🧪 Testing parseArgs() function\n', ['cyan', 'boild'])

// ========== 基础功能测试 ==========

colorLog('\n📋 测试 1: 位置参数', ['cyan-bg'])
const r1 = parseArgs(['node', 'script.js', 'arg1', 'arg2', 'arg3'])
colorLog(`  位置参数: [${r1._.join(', ')}]`, 'green')
r1._.length === 3 ? colorLog(`  ✓ 有 3 个位置参数`, 'green') : colorLog(`  ✗ 位置参数数量不对: ${r1._.length}`, 'red')
r1._[0] === 'arg1' ? colorLog(`  ✓ 第一个参数是 arg1`, 'green') : colorLog(`  ✗ 第一个参数错误: ${r1._[0]}`, 'red')

colorLog('\n📋 测试 2: --key=value 格式', ['cyan-bg'])
const r2 = parseArgs(['node', 'script.js', '--version=9', '--name=test'])
colorLog(`  version: ${r2.version}`, 'green')
colorLog(`  name: ${r2.name}`, 'green')
r2.version === '9' ? colorLog(`  ✓ version 是 9`, 'green') : colorLog(`  ✗ version 错误: ${r2.version}`, 'red')
r2.name === 'test' ? colorLog(`  ✓ name 是 test`, 'green') : colorLog(`  ✗ name 错误: ${r2.name}`, 'red')

colorLog('\n📋 测试 3: --key value 格式', ['cyan-bg'])
const r3 = parseArgs(['node', 'script.js', '--version', '8', '--name', 'app'])
colorLog(`  version: ${r3.version}`, 'green')
colorLog(`  name: ${r3.name}`, 'green')
r3.version === '8' ? colorLog(`  ✓ version 是 8`, 'green') : colorLog(`  ✗ version 错误: ${r3.version}`, 'red')
r3.name === 'app' ? colorLog(`  ✓ name 是 app`, 'green') : colorLog(`  ✗ name 错误: ${r3.name}`, 'red')

colorLog('\n📋 测试 4: --key 布尔值', ['cyan-bg'])
const r4 = parseArgs(['node', 'script.js', '--typescript', '--react'])
colorLog(`  typescript: ${r4.typescript}`, 'green')
colorLog(`  react: ${r4.react}`, 'green')
r4.typescript === true ? colorLog(`  ✓ typescript 是 true`, 'green') : colorLog(`  ✗ typescript 错误: ${r4.typescript}`, 'red')
r4.react === true ? colorLog(`  ✓ react 是 true`, 'green') : colorLog(`  ✗ react 错误: ${r4.react}`, 'red')

colorLog('\n📋 测试 5: -abc 组合短选项', ['cyan-bg'])
const r5 = parseArgs(['node', 'script.js', '-tr'], {
  flags: { t: 'typescript', r: 'react' },
})
colorLog(`  typescript: ${r5.typescript}`, 'green')
colorLog(`  react: ${r5.react}`, 'green')
r5.typescript === true ? colorLog(`  ✓ typescript 是 true`, 'green') : colorLog(`  ✗ typescript 错误: ${r5.typescript}`, 'red')
r5.react === true ? colorLog(`  ✓ react 是 true`, 'green') : colorLog(`  ✗ react 错误: ${r5.react}`, 'red')

// ========== 选项映射测试 ==========

colorLog('\n📋 测试 6: flags 短选项映射', ['cyan-bg'])
const r6 = parseArgs(['node', 'script.js', '-t', '-r'], {
  flags: { t: 'typescript', r: 'react' },
})
colorLog(`  typescript: ${r6.typescript}`, 'green')
colorLog(`  react: ${r6.react}`, 'green')
r6.typescript === true ? colorLog(`  ✓ typescript 是 true`, 'green') : colorLog(`  ✗ typescript 错误: ${r6.typescript}`, 'red')
r6.react === true ? colorLog(`  ✓ react 是 true`, 'green') : colorLog(`  ✗ react 错误: ${r6.react}`, 'red')

colorLog('\n📋 测试 7: aliases 长选项别名', ['cyan-bg'])
const r7 = parseArgs(['node', 'script.js', '--ts', '--version=8'], {
  aliases: { ts: 'typescript' },
})
colorLog(`  typescript: ${r7.typescript}`, 'green')
colorLog(`  version: ${r7.version}`, 'green')
r7.typescript === true ? colorLog(`  ✓ typescript 是 true`, 'green') : colorLog(`  ✗ typescript 错误: ${r7.typescript}`, 'red')
r7.version === '8' ? colorLog(`  ✓ version 是 8`, 'green') : colorLog(`  ✗ version 错误: ${r7.version}`, 'red')

colorLog('\n📋 测试 8: defaults 默认值', ['cyan-bg'])
const r8 = parseArgs(['node', 'script.js'], {
  defaults: { version: '8', typescript: false, react: false },
})
colorLog(`  version: ${r8.version}`, 'green')
colorLog(`  typescript: ${r8.typescript}`, 'green')
colorLog(`  react: ${r8.react}`, 'green')
r8.version === '8' ? colorLog(`  ✓ version 是 8`, 'green') : colorLog(`  ✗ version 错误: ${r8.version}`, 'red')
r8.typescript === false ? colorLog(`  ✓ typescript 是 false`, 'green') : colorLog(`  ✗ typescript 错误: ${r8.typescript}`, 'red')

colorLog('\n📋 测试 9: 默认值被覆盖', ['cyan-bg'])
const r9 = parseArgs(['node', 'script.js', '--version=9', '--typescript'], {
  defaults: { version: '8', typescript: false },
})
colorLog(`  version: ${r9.version} (覆盖默认值 8)`, 'green')
colorLog(`  typescript: ${r9.typescript} (覆盖默认值 false)`, 'green')
r9.version === '9' ? colorLog(`  ✓ version 被覆盖为 9`, 'green') : colorLog(`  ✗ version 错误: ${r9.version}`, 'red')
r9.typescript === true ? colorLog(`  ✓ typescript 被覆盖为 true`, 'green') : colorLog(`  ✗ typescript 错误: ${r9.typescript}`, 'red')

// ========== 混合使用测试 ==========

colorLog('\n📋 测试 10: 位置参数 + 选项', ['cyan-bg'])
const r10 = parseArgs(['node', 'script.js', 'build', 'src/', '--watch', '--output=dist'])
colorLog(`  位置参数: [${r10._.join(', ')}]`, 'green')
colorLog(`  watch: ${r10.watch}`, 'green')
colorLog(`  output: ${r10.output}`, 'green')
r10._[0] === 'build' ? colorLog(`  ✓ 第一个位置参数是 build`, 'green') : colorLog(`  ✗ 第一个位置参数错误: ${r10._[0]}`, 'red')
r10._[1] === 'src/' ? colorLog(`  ✓ 第二个位置参数是 src/`, 'green') : colorLog(`  ✗ 第二个位置参数错误: ${r10._[1]}`, 'red')
r10.watch === true ? colorLog(`  ✓ watch 是 true`, 'green') : colorLog(`  ✗ watch 错误: ${r10.watch}`, 'red')
r10.output === 'dist' ? colorLog(`  ✓ output 是 dist`, 'green') : colorLog(`  ✗ output 错误: ${r10.output}`, 'red')

colorLog('\n📋 测试 11: 所有功能组合', ['cyan-bg'])
const r11 = parseArgs(['node', 'script.js', 'init', '--version=9', '-tr', '--name', 'myapp'], {
  flags: { t: 'typescript', r: 'react' },
  aliases: { version: 'ver' },
  defaults: { port: 3000 },
})
colorLog(`  位置参数: [${r11._.join(', ')}]`, 'green')
colorLog(`  ver: ${r11.ver}`, 'green')
colorLog(`  typescript: ${r11.typescript}`, 'green')
colorLog(`  react: ${r11.react}`, 'green')
colorLog(`  name: ${r11.name}`, 'green')
colorLog(`  port: ${r11.port} (默认值)`, 'green')
r11._[0] === 'init' ? colorLog(`  ✓ 位置参数是 init`, 'green') : colorLog(`  ✗ 位置参数错误: ${r11._[0]}`, 'red')
r11.ver === '9' ? colorLog(`  ✓ ver 是 9`, 'green') : colorLog(`  ✗ ver 错误: ${r11.ver}`, 'red')
r11.typescript === true ? colorLog(`  ✓ typescript 是 true`, 'green') : colorLog(`  ✗ typescript 错误: ${r11.typescript}`, 'red')
r11.react === true ? colorLog(`  ✓ react 是 true`, 'green') : colorLog(`  ✗ react 错误: ${r11.react}`, 'red')
r11.name === 'myapp' ? colorLog(`  ✓ name 是 myapp`, 'green') : colorLog(`  ✗ name 错误: ${r11.name}`, 'red')
r11.port === 3000 ? colorLog(`  ✓ port 保持默认值 3000`, 'green') : colorLog(`  ✗ port 错误: ${r11.port}`, 'red')

// ========== 边界情况测试 ==========

colorLog('\n📋 测试 12: 空参数', ['cyan-bg'])
const r12 = parseArgs(['node', 'script.js'])
colorLog(`  结果: ${JSON.stringify(r12)}`, 'green')
r12._.length === 0 ? colorLog(`  ✓ 位置参数是空数组`, 'green') : colorLog(`  ✗ 位置参数不是空数组: ${r12._.length}`, 'red')

colorLog('\n📋 测试 13: 只有位置参数', ['cyan-bg'])
const r13 = parseArgs(['node', 'script.js', 'one', 'two', 'three'])
colorLog(`  位置参数: [${r13._.join(', ')}]`, 'green')
r13._.length === 3 ? colorLog(`  ✓ 有 3 个位置参数`, 'green') : colorLog(`  ✗ 位置参数数量错误: ${r13._.length}`, 'red')

colorLog('\n📋 测试 14: --key 后面是另一个选项', ['cyan-bg'])
const r14 = parseArgs(['node', 'script.js', '--watch', '--verbose'])
colorLog(`  watch: ${r14.watch}`, 'green')
colorLog(`  verbose: ${r14.verbose}`, 'green')
r14.watch === true ? colorLog(`  ✓ watch 是 true`, 'green') : colorLog(`  ✗ watch 错误: ${r14.watch}`, 'red')
r14.verbose === true ? colorLog(`  ✓ verbose 是 true`, 'green') : colorLog(`  ✗ verbose 错误: ${r14.verbose}`, 'red')

colorLog('\n📋 测试 15: 包含等号的值', ['cyan-bg'])
const r15 = parseArgs(['node', 'script.js', '--env=NODE_ENV=production'])
colorLog(`  env: ${r15.env}`, 'green')
r15.env === 'NODE_ENV=production' ? colorLog(`  ✓ env 包含等号`, 'green') : colorLog(`  ✗ env 错误: ${r15.env}`, 'red')

colorLog('\n📋 测试 16: 数字值', ['cyan-bg'])
const r16 = parseArgs(['node', 'script.js', '--port=3000', '--timeout', '5000'])
colorLog(`  port: ${r16.port} (类型: ${typeof r16.port})`, 'green')
colorLog(`  timeout: ${r16.timeout} (类型: ${typeof r16.timeout})`, 'green')
r16.port === '3000' ? colorLog(`  ✓ port 是字符串 3000`, 'green') : colorLog(`  ✗ port 错误: ${r16.port}`, 'red')
r16.timeout === '5000' ? colorLog(`  ✓ timeout 是字符串 5000`, 'green') : colorLog(`  ✗ timeout 错误: ${r16.timeout}`, 'red')

// ========== 实际使用场景测试 ==========

colorLog('\n📋 测试 17: ESLint 初始化场景', ['cyan-bg'])
const r17 = parseArgs(['node', 'bkou-eslint-init', '--version=9', '--ts', '--react'], {
  aliases: { ts: 'typescript' },
  defaults: { version: '8', typescript: false, react: false },
})
colorLog(`  version: ${r17.version}`, 'green')
colorLog(`  typescript: ${r17.typescript}`, 'green')
colorLog(`  react: ${r17.react}`, 'green')
r17.version === '9' ? colorLog(`  ✓ version 是 9`, 'green') : colorLog(`  ✗ version 错误: ${r17.version}`, 'red')
r17.typescript === true ? colorLog(`  ✓ typescript 是 true`, 'green') : colorLog(`  ✗ typescript 错误: ${r17.typescript}`, 'red')
r17.react === true ? colorLog(`  ✓ react 是 true`, 'green') : colorLog(`  ✗ react 错误: ${r17.react}`, 'red')

colorLog('\n📋 测试 18: Git 命令场景', ['cyan-bg'])
const r18 = parseArgs(['node', 'git', 'commit', '-am', 'fix: bug'], {
  flags: { a: 'all', m: 'message' },
})
colorLog(`  位置参数: [${r18._.join(', ')}]`, 'green')
colorLog(`  all: ${r18.all}`, 'green')
colorLog(`  message: ${r18.message}`, 'green')
r18._[0] === 'commit' ? colorLog(`  ✓ 命令是 commit`, 'green') : colorLog(`  ✗ 命令错误: ${r18._[0]}`, 'red')
r18._[1] === 'fix: bug' ? colorLog(`  ✓ 消息是 fix: bug`, 'green') : colorLog(`  ✗ 消息错误: ${r18._[1]}`, 'red')
r18.all === true ? colorLog(`  ✓ all 是 true`, 'green') : colorLog(`  ✗ all 错误: ${r18.all}`, 'red')
r18.message === true ? colorLog(`  ✓ message 是 true`, 'green') : colorLog(`  ✗ message 错误: ${r18.message}`, 'red')

colorLog('\n📋 测试 19: npm run 场景', ['cyan-bg'])
const r19 = parseArgs(['node', 'npm', 'run', 'build', '--', '--watch', '--mode=production'])
colorLog(`  位置参数: [${r19._.join(', ')}]`, 'green')
colorLog(`  watch: ${r19.watch}`, 'green')
colorLog(`  mode: ${r19.mode}`, 'green')
r19._[0] === 'run' ? colorLog(`  ✓ 第一个参数是 run`, 'green') : colorLog(`  ✗ 第一个参数错误: ${r19._[0]}`, 'red')
r19._[1] === 'build' ? colorLog(`  ✓ 第二个参数是 build`, 'green') : colorLog(`  ✗ 第二个参数错误: ${r19._[1]}`, 'red')
r19._[2] === '--watch' ? colorLog(`  ✓ -- 后的参数作为位置参数: --watch`, 'green') : colorLog(`  ✗ 第三个参数错误: ${r19._[2]}`, 'red')
r19._[3] === '--mode=production' ? colorLog(`  ✓ -- 后的参数作为位置参数: --mode=production`, 'green') : colorLog(`  ✗ 第四个参数错误: ${r19._[3]}`, 'red')
r19.watch === undefined ? colorLog(`  ✓ watch 未被解析为选项`, 'green') : colorLog(`  ✗ watch 应该是 undefined: ${r19.watch}`, 'red')
r19.mode === undefined ? colorLog(`  ✓ mode 未被解析为选项`, 'green') : colorLog(`  ✗ mode 应该是 undefined: ${r19.mode}`, 'red')

colorLog('\n📋 测试 20: 无选项配置', ['cyan-bg'])
const r20 = parseArgs(['node', 'script.js', '--name=test', '-abc', 'arg1'])
colorLog(`  name: ${r20.name}`, 'green')
colorLog(`  a: ${r20.a}`, 'green')
colorLog(`  b: ${r20.b}`, 'green')
colorLog(`  c: ${r20.c}`, 'green')
colorLog(`  位置参数: [${r20._.join(', ')}]`, 'green')
r20.name === 'test' ? colorLog(`  ✓ name 是 test`, 'green') : colorLog(`  ✗ name 错误: ${r20.name}`, 'red')
r20.a === true ? colorLog(`  ✓ a 是 true`, 'green') : colorLog(`  ✗ a 错误: ${r20.a}`, 'red')
r20.b === true ? colorLog(`  ✓ b 是 true`, 'green') : colorLog(`  ✗ b 错误: ${r20.b}`, 'red')
r20.c === true ? colorLog(`  ✓ c 是 true`, 'green') : colorLog(`  ✗ c 错误: ${r20.c}`, 'red')
r20._[0] === 'arg1' ? colorLog(`  ✓ 位置参数是 arg1`, 'green') : colorLog(`  ✗ 位置参数错误: ${r20._[0]}`, 'red')

colorLog('\n✅ 所有测试完成！', ['green', 'boild'])
