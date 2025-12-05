import { spawn /*, spawnSync */ } from 'child_process';
import type { SpawnOptions } from 'child_process'
import { colorLog } from '../log/colorLog.js'

type RunOptions = SpawnOptions & {
  silent?: boolean;
}

type RunResult = {
  code: number;
  signal: NodeJS.Signals;
  stdout: Buffer;
  stderr: Buffer;
}

const isStreamReadable = (stream) => {
  return (
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function' &&
    stream.readable !== false
  )
}

const streamToBuffer = (stream, onData) => new Promise<Buffer>((resolve, reject) => {
  if (!isStreamReadable(stream)) {
    return reject(new Error('expect stream is readable'))
  }
  const data = []
  stream.on('error', reject)
  stream.on('close', () => reject(new Error('unexpected stream close')))
  stream.on('end', () => resolve(Buffer.concat(data)))
  stream.on('data', (chunk) => {
    data.push(chunk)
    onData && onData(chunk)
  })
})

const run = (_command: string | string[], _options: RunOptions = {}) => {
  const { silent = false, shell = false, ...optionsRest } = _options
  const childProcess = Array.isArray(_command)
    ? spawn(_command[0], _command.slice(1), { stdio: ['ignore', 'pipe', 'pipe'], ...optionsRest })
    : shell
      ? spawn(_command, { shell: true, stdio: ['ignore', 'pipe', 'pipe'], ...optionsRest })
      : (() => {
        const [command, ...args] = _command.split(' ')
        return spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], ...optionsRest })
      })()
  const stdoutPromise = streamToBuffer(
    childProcess.stdout,
    silent ? null : (chunk) => process.stdout.write(chunk),
  )
  const stderrPromise = streamToBuffer(
    childProcess.stderr,
    silent ? null : (chunk) => process.stderr.write(chunk),
  )
  const promise = new Promise<RunResult>((resolve, reject) => {
    childProcess.on('close', async (code, signal) => {
      const [stdout, stderr] = await Promise.all([stdoutPromise, stderrPromise])
      if (code === 0) {
        resolve({ code, signal, stdout, stderr })
      } else {
        const error = {
          message: `Process exited with code ${code}`,
          code, signal, stdout, stderr,
        }
        reject(error)
      }
    })
    childProcess.on('error', reject)
  })
  return { childProcess, promise, stdoutPromise, stderrPromise }
}

// ========== 测试代码 ==========

// 测试 1: 数组参数（推荐，最安全）
console.log('=== 测试 1: 数组参数 ===')
const { promise: p1 } = run(['echo', 'Hello with spaces'])
const r1 = await p1
colorLog(`输出: ${r1.stdout.toString()}`, ['green'])

// 测试 2: shell 模式（需要管道等特性时使用）
console.log('\n=== 测试 2: shell 模式 - 管道 ===')
const { promise: p2 } = run('echo "Hello" && echo "World" >&2', { shell: true })
const r2 = await p2
colorLog(`stdout: ${r2.stdout.toString()}`, ['green'])
colorLog(`stderr: ${r2.stderr.toString()}`, ['red'])

// 测试 3: silent 模式
console.log('\n=== 测试 3: silent 模式 ===')
const { promise: p3 } = run(['echo', 'Silent output'], { silent: true })
const r3 = await p3
colorLog(`收集到: ${r3.stdout.toString()}`, ['cyan'])

// 测试 4: 简单字符串命令
console.log('\n=== 测试 4: 字符串命令 ===')
const { promise: p4 } = run('echo Simple')
await p4

// 测试 5: 测试特殊字符（数组安全）
console.log('\n=== 测试 5: 特殊字符测试 ===')
const { promise: p5 } = run(['echo', 'Price: $100; echo "test"'])
const r5 = await p5
colorLog(`安全输出: ${r5.stdout.toString()}`, ['cyan'])

// 测试 6: 错误处理
console.log('\n=== 测试 6: 错误处理 ===')
try {
  await run(['ls', '/nonexistent']).promise
} catch (error) {
  colorLog(`错误码: ${error.code}`, ['red'])
  colorLog(`错误信息: ${error.stderr.toString()}`, ['magenta'])
}

// 测试 7: 分别获取输出流
console.log('\n=== 测试 7: 分别获取输出流 ===')
const { stdoutPromise, stderrPromise } = run('echo "Out" && echo "Err" >&2', { shell: true, silent: true })
const stdout7 = await stdoutPromise
const stderr7 = await stderrPromise
colorLog(`独立获取 stdout: ${stdout7.toString()}`, ['green'])
colorLog(`独立获取 stderr: ${stderr7.toString()}`, ['red'])

// 测试 8: 进程控制
console.log('\n=== 测试 8: 进程控制 (2秒后杀死) ===')
const { childProcess: cp8, promise: p8 } = run(['sleep', '5'])
setTimeout(() => {
  cp8.kill('SIGTERM')
}, 2000)
try {
  await p8
} catch (error) {
  colorLog(`被信号终止: ${error.signal}`, ['yellow'])
  colorLog(`退出码: ${error.code}`, ['yellow'])
}

// 测试 9: 并行执行多个任务
console.log('\n=== 测试 9: 并行执行 ===')
const task1 = run(['echo', 'Task 1'], { silent: true })
const task2 = run(['echo', 'Task 2'], { silent: true })
const task3 = run(['echo', 'Task 3'], { silent: true })
const results = await Promise.all([task1.promise, task2.promise, task3.promise])
results.forEach((r, i) => colorLog(`任务${i + 1}: ${r.stdout.toString()}`, ['green']))

// 测试 10: 获取 git 信息
console.log('\n=== 测试 10: 实际应用 - Git 信息 ===')
try {
  const { promise: p10 } = run(['git', 'rev-parse', '--short', 'HEAD'], { silent: true })
  const r10 = await p10
  colorLog(`当前 commit: ${r10.stdout.toString().trim()}`, ['cyan'])
} catch {
  colorLog('不在 git 仓库中或 git 未安装', ['yellow'])
}

console.log('\n=== 所有测试完成 ===')

export {
  run,
}
