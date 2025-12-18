import { colorLog } from 'cli/log/colorLog.js'

// ========== runHelper 辅助函数测试 ==========
import { runSilent, runResult, runStdResult } from './runHelper.js'

colorLog('🧪 Testing runHelper functions\n', ['cyan', 'boild'])

// ========== runSilent() 测试 ==========

colorLog('\n📋 测试 1: runSilent - 静默执行并返回完整结果', ['cyan-bg'])
const result1 = await runSilent(['echo', 'Silent test'])
colorLog(`  ✓ 返回 RunResult 对象: ${result1.code !== undefined}`, ['green'])
colorLog(`  ✓ code: ${result1.code}`, ['green'])
colorLog(`  ✓ stdout: "${result1.stdout.toString().trim()}"`, ['green'])
colorLog(`  ✓ stdout 是 Buffer: ${Buffer.isBuffer(result1.stdout)}`, ['green'])

colorLog('\n📋 测试 2: runSilent - 控制台应无输出', ['cyan-bg'])
colorLog('  ℹ️  下一行不应该出现 "This should not appear"', ['cyan'])
await runSilent(['echo', 'This should not appear'])
colorLog('  ✓ 测试通过（如果上面没有看到输出）', ['green'])

// ========== runResult() 测试 ==========

colorLog('\n📋 测试 3: runResult - 返回处理后的字符串', ['cyan-bg'])
const str1 = await runResult(['echo', 'Hello World'])
colorLog(`  ✓ 返回类型是 string: ${typeof str1 === 'string'}`, ['green'])
colorLog(`  ✓ 已 trim: "${str1}"`, ['green'])
colorLog(`  ✓ 无换行符: ${!str1.includes('\n')}`, ['green'])

colorLog('\n📋 测试 4: runResult - 多行输出处理', ['cyan-bg'])
const str2 = await runResult('echo "Line 1\nLine 2"', { shell: true })
colorLog(`  ✓ 输出: "${str2}"`, ['cyan'])
colorLog(`  ✓ 包含换行: ${str2.includes('\n')}`, ['green'])

colorLog('\n📋 测试 5: runResult - 字符串命令', ['cyan-bg'])
const str3 = await runResult('echo String command test')
colorLog(`  ✓ 输出: "${str3}"`, ['green'])

// ========== runStdResult() 测试 ==========

colorLog('\n📋 测试 6: runStdResult - 收集且显示', ['cyan-bg'])
colorLog('  ℹ️  下一行应该会显示 "This will be shown"', ['cyan'])
const str4 = await runStdResult(['echo', 'This will be shown'])
colorLog(`  ✓ 返回字符串: "${str4}"`, ['green'])
colorLog(`  ✓ 类型是 string: ${typeof str4 === 'string'}`, ['green'])

colorLog('\n📋 测试 7: runStdResult vs runResult 对比', ['cyan-bg'])
colorLog('  ℹ️  runResult 不显示：', ['cyan'])
const silent = await runResult(['echo', 'Silent version'])
colorLog('  ℹ️  runStdResult 会显示：', ['cyan'])
const shown = await runStdResult(['echo', 'Shown version'])
colorLog(`  ✓ 两者返回相同类型: ${typeof silent === typeof shown}`, ['green'])

// ========== 实际应用场景 ==========

colorLog('\n📋 测试 8: 获取 Git commit hash', ['cyan-bg'])
try {
  const commit = await runResult(['git', 'rev-parse', '--short', 'HEAD'])
  colorLog(`  ✓ commit: ${commit}`, ['green'])
  colorLog(`  ✓ 长度: ${commit.length}`, ['cyan'])
} catch {
  colorLog('  ⚠ 不在 git 仓库中或 git 未安装', ['yellow'])
}

colorLog('\n📋 测试 9: 获取 Node.js 版本', ['cyan-bg'])
const nodeVersion = await runResult(['node', '-v'])
colorLog(`  ✓ Node 版本: ${nodeVersion}`, ['green'])

colorLog('\n📋 测试 10: 管道命令', ['cyan-bg'])
const piped = await runResult('echo "HELLO" | tr "A-Z" "a-z"', { shell: true })
colorLog(`  ✓ 转小写结果: "${piped}"`, ['green'])

// ========== 错误处理测试 ==========

colorLog('\n📋 测试 11: runResult 错误处理', ['cyan-bg'])
try {
  await runResult(['ls', '/nonexistent_12345'])
  colorLog('  ✗ 应该抛出错误', ['red'])
} catch (error) {
  colorLog(`  ✓ 捕获错误: code=${error.code}`, ['green'])
  colorLog(`  ✓ stderr 存在: ${error.stderr !== undefined}`, ['green'])
}

colorLog('\n📋 测试 12: runSilent 错误处理', ['cyan-bg'])
try {
  await runSilent('exit 1', { shell: true })
  colorLog('  ✗ 应该抛出错误', ['red'])
} catch (error) {
  colorLog(`  ✓ 捕获错误: code=${error.code}`, ['green'])
}

// ========== 并发测试 ==========

colorLog('\n📋 测试 13: 并发执行 runResult', ['cyan-bg'])
const [r1, r2, r3] = await Promise.all([
  runResult(['echo', 'Task 1']),
  runResult(['echo', 'Task 2']),
  runResult(['echo', 'Task 3']),
])
colorLog(`  ✓ 任务1: "${r1}"`, ['green'])
colorLog(`  ✓ 任务2: "${r2}"`, ['green'])
colorLog(`  ✓ 任务3: "${r3}"`, ['green'])

// ========== 性能对比 ==========

colorLog('\n📋 测试 14: runResult vs runStdResult 性能', ['cyan-bg'])
const start1 = Date.now()
await runResult(['seq', '1', '100'])
const time1 = Date.now() - start1

const start2 = Date.now()
await runStdResult(['seq', '1', '100'])
const time2 = Date.now() - start2

colorLog(`  ✓ runResult 耗时: ${time1}ms`, ['cyan'])
colorLog(`  ✓ runStdResult 耗时: ${time2}ms`, ['cyan'])

// ========== 复杂场景 ==========

colorLog('\n📋 测试 15: 组合使用不同函数', ['cyan-bg'])
const hasGit = await runResult('which git', { shell: true })
  .then(() => true)
  .catch(() => false)

if (hasGit) {
  const branch = await runResult(['git', 'rev-parse', '--abbrev-ref', 'HEAD'])
  colorLog(`  ✓ 当前分支: ${branch}`, ['green'])
} else {
  colorLog('  ⚠ Git 不可用', ['yellow'])
}

colorLog('\n✅ 所有测试完成！', ['green', 'boild'])
