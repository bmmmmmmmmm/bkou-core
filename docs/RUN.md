# run() - 增强的子进程执行函数

`run()` 是对 Node.js `spawn()` 的封装，提供了更友好的 Promise API 和自动化的流处理功能。

## 基本用法

```typescript
import { run } from './common/runTask/run.js'

// 最简单的用法
await run(['echo', 'Hello World']).promise

// 使用字符串命令（自动分割参数）
await run('npm install').promise

// 使用 shell 模式（支持管道、重定向等）
await run('ls -la | grep node', { shell: true }).promise
```

## API 定义

### 函数签名

```typescript
function run(
  command: string | string[],
  options?: RunOptions
): {
  childProcess: ChildProcess
  promise: Promise<RunResult>
  stdoutPromise: Promise<Buffer | null>
  stderrPromise: Promise<Buffer | null>
}
```

### RunOptions

继承自 Node.js 的 `SpawnOptions`，并新增了 `io` 参数：

```typescript
type RunOptions = SpawnOptions & {
  io?: 'default' | 'silent' | 'inherit'
}
```

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|--------|-----|
| `io` | `'default' \| 'silent' \| 'inherit'` | `'default'` | 控制输入输出行为 |
| `shell` | `boolean` | `false` | 是否使用 shell 执行 |
| `cwd` | `string` | - | 工作目录 |
| `env` | `object` | - | 环境变量 |
| ...其他 | - | - | 所有 `SpawnOptions` 参数 |

### io 模式详解

#### `'default'` - 边显示边收集（默认）

- ✅ **收集输出**：`stdout` 和 `stderr` 返回完整的 Buffer
- ✅ **实时显示**：输出会同步显示到控制台
- 💡 **适用场景**：需要查看输出内容，同时也要实时看到进度

```typescript
const { stdout } = await run('npm install').promise
console.log('安装日志:', stdout.toString())
// 控制台会实时显示 npm 的安装进度
```

#### `'silent'` - 只收集不显示

- ✅ **收集输出**：`stdout` 和 `stderr` 返回完整的 Buffer
- ❌ **不显示**：控制台不会有任何输出
- 💡 **适用场景**：只需要获取输出结果，不需要污染控制台

```typescript
const { stdout } = await run('git rev-parse HEAD', { io: 'silent' }).promise
const commit = stdout.toString().trim()
// 控制台不会显示 commit hash
```

#### `'inherit'` - 实时显示不收集

- ❌ **不收集**：`stdout` 和 `stderr` 返回 `null`
- ✅ **实时显示**：输出直接传递给父进程的 TTY，无缓冲
- 💡 **适用场景**：交互式命令、进度条、大量输出

```typescript
await run('npm install', { io: 'inherit' }).promise
// stdout 和 stderr 是 null，无法获取输出内容
// 但 npm 的进度条会正常显示
```

**为什么 inherit 模式不收集输出？**

因为在 `inherit` 模式下，stdio 被设置为 `'inherit'`，子进程的标准流直接连接到父进程，没有中间的 pipe，所以无法截获数据。这是性能最优的方式，适合大量输出或需要 TTY 特性（如进度条）的场景。

### RunResult

Promise 成功时返回的结果：

```typescript
type RunResult = {
  code: number          // 退出码
  signal: NodeJS.Signals // 终止信号
  stdout: Buffer        // 标准输出（inherit 模式下为 null）
  stderr: Buffer        // 标准错误（inherit 模式下为 null）
}
```

Promise 失败时的错误对象包含相同的字段，便于调试：

```typescript
try {
  await run('exit 1').promise
} catch (error) {
  console.log(error.code)    // 1
  console.log(error.stdout)  // Buffer
  console.log(error.stderr)  // Buffer
}
```

## 命令格式

### 数组格式（推荐）

```typescript
// ✅ 推荐：参数清晰，不需要转义
await run(['git', 'commit', '-m', 'fix: bug']).promise
await run(['echo', 'hello world']).promise
```

### 字符串格式

```typescript
// ✅ 简洁的命令
await run('npm install').promise
await run('git status').promise

// ⚠️ 注意：空格分割，不支持引号
await run('echo hello world').promise  // 等同于 ['echo', 'hello', 'world']
```

### Shell 模式

```typescript
// ✅ 使用 shell 特性（管道、重定向、变量等）
await run('ls -la | grep node', { shell: true }).promise
await run('echo $PATH', { shell: true }).promise
await run('cat file.txt > output.txt', { shell: true }).promise
```

## 使用示例

### 1. 获取命令输出

```typescript
const { stdout } = await run(['git', 'rev-parse', '--short', 'HEAD'], {
  io: 'silent'
}).promise

const commit = stdout.toString().trim()
console.log(`当前 commit: ${commit}`)
```

### 2. 检查命令是否存在

```typescript
try {
  await run(['which', 'node'], { io: 'silent' }).promise
  console.log('Node.js 已安装')
} catch {
  console.log('Node.js 未安装')
}
```

### 3. 实时显示进度（npm install）

```typescript
// 使用 inherit 模式，npm 的进度条会正常显示
await run('npm install', { io: 'inherit' }).promise
console.log('安装完成！')
```

### 4. 错误处理

```typescript
try {
  await run(['ls', '/nonexistent'], { io: 'silent' }).promise
} catch (error) {
  console.log('命令失败')
  console.log('退出码:', error.code)
  console.log('错误信息:', error.stderr.toString())
}
```

### 5. 处理信号终止

```typescript
const { childProcess, promise } = run(['sleep', '60'])

// 5 秒后终止进程
setTimeout(() => childProcess.kill('SIGTERM'), 5000)

try {
  await promise
} catch (error) {
  console.log('进程被信号终止:', error.signal) // SIGTERM
}
```

### 6. 并行执行多个命令

```typescript
const tasks = [
  run(['npm', 'run', 'lint'], { io: 'silent' }),
  run(['npm', 'run', 'test'], { io: 'silent' }),
  run(['npm', 'run', 'build'], { io: 'silent' }),
]

const results = await Promise.all(tasks.map(t => t.promise))
console.log('所有任务完成')
```

### 7. 独立处理 stdout 和 stderr

```typescript
const { stdoutPromise, stderrPromise } = run('npm install', {
  io: 'silent'
})

// 可以分别等待和处理
const stdout = await stdoutPromise
const stderr = await stderrPromise

console.log('标准输出:', stdout.toString())
console.log('错误输出:', stderr.toString())
```

### 8. 自定义工作目录和环境变量

```typescript
await run('npm install', {
  cwd: '/path/to/project',
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
}).promise
```

### 9. Shell 脚本式操作

```typescript
// 管道
const { stdout } = await run('ps aux | grep node', {
  shell: true,
  io: 'silent',
}).promise

// 重定向
await run('echo "Hello" > output.txt', { shell: true }).promise

// 环境变量
await run('export NODE_ENV=prod && npm run build', {
  shell: true,
}).promise
```

## 对比 spawn()

### 使用 spawn（原生）

```typescript
import { spawn } from 'child_process'

const child = spawn('npm', ['install'])
const stdout = []
const stderr = []

child.stdout.on('data', chunk => {
  stdout.push(chunk)
  process.stdout.write(chunk)
})

child.stderr.on('data', chunk => {
  stderr.push(chunk)
  process.stderr.write(chunk)
})

await new Promise((resolve, reject) => {
  child.on('close', (code) => {
    if (code === 0) {
      resolve({ stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) })
    } else {
      reject(new Error(`Exit code: ${code}`))
    }
  })
  child.on('error', reject)
})
```

### 使用 run（封装）

```typescript
import { run } from './common/runTask/run.js'

const { stdout, stderr } = await run('npm install').promise
// 自动处理流收集、显示和错误
```

**优势：**
- ✅ Promise API，支持 async/await
- ✅ 自动收集和显示输出
- ✅ 统一的错误处理
- ✅ 三种 io 模式灵活切换
- ✅ 代码简洁，减少样板代码

## 注意事项

### 1. inherit 模式下无法获取输出

```typescript
const result = await run('echo test', { io: 'inherit' }).promise
console.log(result.stdout) // null ⚠️
console.log(result.stderr) // null ⚠️
```

### 2. 字符串命令的空格分割限制

```typescript
// ❌ 不支持引号，会被分割成 3 个参数
await run('echo "hello world"').promise

// ✅ 使用数组格式
await run(['echo', 'hello world']).promise

// ✅ 或使用 shell 模式
await run('echo "hello world"', { shell: true }).promise
```

### 3. 错误处理是必须的

```typescript
// ❌ 未捕获的 Promise 会导致程序崩溃
await run('exit 1').promise

// ✅ 使用 try-catch
try {
  await run('exit 1').promise
} catch (error) {
  console.log('命令失败:', error.code)
}
```

### 4. shell 模式的安全性

```typescript
// ⚠️ 如果 userInput 来自用户输入，可能有注入风险
const userInput = req.query.file
await run(`cat ${userInput}`, { shell: true }).promise

// ✅ 使用数组格式避免注入
await run(['cat', userInput]).promise
```

## 进阶技巧

### 1. 超时控制

```typescript
const timeout = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), ms)
)

try {
  await Promise.race([
    run(['sleep', '10']).promise,
    timeout(5000),
  ])
} catch (error) {
  console.log('命令超时')
}
```

### 2. 重试机制

```typescript
async function runWithRetry(command, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await run(command, options).promise
    } catch (error) {
      if (i === maxRetries - 1) throw error
      console.log(`重试 ${i + 1}/${maxRetries}...`)
    }
  }
}

await runWithRetry('npm install', { io: 'inherit' })
```

### 3. 实时解析输出

```typescript
const { childProcess, promise } = run('npm install', { io: 'silent' })

const stdout = []
childProcess.stdout.on('data', (chunk) => {
  stdout.push(chunk)
  const text = chunk.toString()
  if (text.includes('WARN')) {
    console.log('检测到警告:', text)
  }
})

await promise
```

## TypeScript 类型

完整的类型定义：

```typescript
import type { SpawnOptions, ChildProcess } from 'child_process'

type RunOptions = SpawnOptions & {
  io?: 'default' | 'silent' | 'inherit'
}

type RunResult = {
  code: number
  signal: NodeJS.Signals
  stdout: Buffer
  stderr: Buffer
}

type RunReturn = {
  childProcess: ChildProcess
  promise: Promise<RunResult>
  stdoutPromise: Promise<Buffer | null>
  stderrPromise: Promise<Buffer | null>
}

function run(
  command: string | string[],
  options?: RunOptions
): RunReturn
```

## 相关资源

- [Node.js child_process 文档](https://nodejs.org/api/child_process.html)
- [Stream API 文档](https://nodejs.org/api/stream.html)
- [进程信号列表](https://man7.org/linux/man-pages/man7/signal.7.html)
