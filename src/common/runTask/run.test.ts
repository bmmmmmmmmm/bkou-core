import { colorLog } from '../log/colorLog.js'

// ========== run() 函数测试 ==========
import { run } from './run.js'

colorLog('🧪 Testing run() function\n', ['cyan', 'boild'])

// ========== io 模式测试 ==========

colorLog('📋 测试 1: io="default" - 边显示边收集', ['yellow'])
const { promise: p1 } = run(['echo', 'Hello World'])
const r1 = await p1
colorLog(`  ✓ 收集到: "${r1.stdout.toString().trim()}"`, ['green'])
colorLog(`  ✓ stdout 是 Buffer: ${Buffer.isBuffer(r1.stdout)}`, ['green'])

colorLog('\n📋 测试 2: io="silent" - 只收集不显示', ['yellow'])
const { promise: p2 } = run(['echo', 'Silent output'], { io: 'silent' })
const r2 = await p2
colorLog(`  ✓ 收集到: "${r2.stdout.toString().trim()}"`, ['green'])
colorLog(`  ✓ 控制台应该没有输出 "Silent output"`, ['cyan'])

colorLog('\n📋 测试 3: io="inherit" - 实时显示不收集', ['yellow'])
const { promise: p3 } = run(['echo', 'Real-time output'], { io: 'inherit' })
const r3 = await p3
colorLog(`  ✓ stdout 是 null: ${r3.stdout === null}`, ['green'])
colorLog(`  ✓ stderr 是 null: ${r3.stderr === null}`, ['green'])

// ========== 命令格式测试 ==========

colorLog('\n📋 测试 4: 数组命令（推荐）', ['yellow'])
const { promise: p4 } = run(['echo', 'Array command'], { io: 'silent' })
const r4 = await p4
colorLog(`  ✓ 输出: "${r4.stdout.toString().trim()}"`, ['green'])

colorLog('\n📋 测试 5: 字符串命令', ['yellow'])
const { promise: p5 } = run('echo String command', { io: 'silent' })
const r5 = await p5
colorLog(`  ✓ 输出: "${r5.stdout.toString().trim()}"`, ['green'])

colorLog('\n📋 测试 6: shell 模式 - 管道', ['yellow'])
const { promise: p6 } = run('echo "Hello" | tr "H" "h"', { shell: true, io: 'silent' })
const r6 = await p6
colorLog(`  ✓ 输出: "${r6.stdout.toString().trim()}"`, ['green'])

// ========== stdout/stderr 分离测试 ==========

colorLog('\n📋 测试 7: 同时输出到 stdout 和 stderr', ['yellow'])
const { promise: p7 } = run('echo "out" && echo "err" >&2', { shell: true, io: 'silent' })
const r7 = await p7
colorLog(`  ✓ stdout: "${r7.stdout.toString().trim()}"`, ['green'])
colorLog(`  ✓ stderr: "${r7.stderr.toString().trim()}"`, ['red'])

colorLog('\n📋 测试 8: 独立获取 stdout/stderr Promise', ['yellow'])
const { stdoutPromise, stderrPromise } = run('echo "A" && echo "B" >&2', { shell: true, io: 'silent' })
const [stdout8, stderr8] = await Promise.all([stdoutPromise, stderrPromise])
colorLog(`  ✓ stdout: "${stdout8.toString().trim()}"`, ['green'])
colorLog(`  ✓ stderr: "${stderr8.toString().trim()}"`, ['red'])

// ========== 错误处理测试 ==========

colorLog('\n📋 测试 9: 命令执行失败', ['yellow'])
try {
  await run(['ls', '/nonexistent_path_12345'], { io: 'silent' }).promise
  colorLog('  ✗ 应该抛出错误', ['red'])
} catch (error: any) {
  colorLog(`  ✓ 捕获错误: code=${error.code}`, ['green'])
  colorLog(`  ✓ 错误信息包含在 stderr 中: ${error.stderr.length > 0}`, ['green'])
}

colorLog('\n📋 测试 10: 进程被信号终止', ['yellow'])
const { childProcess, promise: p10 } = run(['sleep', '10'])
setTimeout(() => childProcess.kill('SIGTERM'), 100)
try {
  await p10
  colorLog('  ✗ 应该抛出错误', ['red'])
} catch (error: any) {
  colorLog(`  ✓ 被信号终止: signal=${error.signal}`, ['green'])
  colorLog(`  ✓ 退出码非 0: code=${error.code}`, ['green'])
}

// ========== 并发执行测试 ==========

colorLog('\n📋 测试 11: 并行执行多个命令', ['yellow'])
const tasks = [
  run(['echo', 'Task 1'], { io: 'silent' }),
  run(['echo', 'Task 2'], { io: 'silent' }),
  run(['echo', 'Task 3'], { io: 'silent' }),
]
const results = await Promise.all(tasks.map(t => t.promise))
results.forEach((r, i) => {
  colorLog(`  ✓ 任务${i + 1}: "${r.stdout.toString().trim()}"`, ['green'])
})

// ========== 大量数据测试 ==========

colorLog('\n📋 测试 12: 处理大量输出（100 行）', ['yellow'])
const { promise: p12 } = run(['seq', '1', '100'], { io: 'silent' })
const r12 = await p12
const lines = r12.stdout.toString().trim().split('\n')
colorLog(`  ✓ 收集了 ${lines.length} 行`, ['green'])
colorLog(`  ✓ 第一行: ${lines[0]}, 最后一行: ${lines[lines.length - 1]}`, ['cyan'])

// ========== 实际应用场景 ==========

colorLog('\n📋 测试 13: 获取 Git 信息', ['yellow'])
try {
  const { promise: p13 } = run(['git', 'rev-parse', '--short', 'HEAD'], { io: 'silent' })
  const r13 = await p13
  const commit = r13.stdout.toString().trim()
  colorLog(`  ✓ 当前 commit: ${commit}`, ['green'])
} catch {
  colorLog('  ⚠ 不在 git 仓库中或 git 未安装', ['yellow'])
}

colorLog('\n📋 测试 14: 检查命令是否存在', ['yellow'])
try {
  await run(['which', 'node'], { io: 'silent' }).promise
  colorLog('  ✓ node 命令存在', ['green'])
} catch {
  colorLog('  ✗ node 命令不存在', ['red'])
}

// ========== 返回值测试 ==========

colorLog('\n📋 测试 15: 验证返回对象结构', ['yellow'])
const result = run(['echo', 'test'], { io: 'silent' })
colorLog(`  ✓ 包含 childProcess: ${result.childProcess !== undefined}`, ['green'])
colorLog(`  ✓ 包含 promise: ${result.promise !== undefined}`, ['green'])
colorLog(`  ✓ 包含 stdoutPromise: ${result.stdoutPromise !== undefined}`, ['green'])
colorLog(`  ✓ 包含 stderrPromise: ${result.stderrPromise !== undefined}`, ['green'])
await result.promise

colorLog('\n✅ 所有测试完成！', ['green', 'boild'])
