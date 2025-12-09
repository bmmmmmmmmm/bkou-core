import { spawn /*, spawnSync */ } from 'child_process';
import type { SpawnOptions, StdioOptions } from 'child_process'
// import { colorLog } from '../log/colorLog.ts'

type RunOptions = SpawnOptions & {
  // inherit → 返回 null
  // silent  → 收集但不显示
  // default → 收集且显示
  io?: 'default' | 'silent' | 'inherit';
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
  const { io = 'default', shell = false, ...optionsRest } = _options

  const useInherit = io === 'inherit'
  const useSilent = io === 'silent'
  const spawnStdio = useInherit ? 'inherit' : ['ignore', 'pipe', 'pipe'] as StdioOptions

  const childProcess = Array.isArray(_command)
    ? spawn(_command[0], _command.slice(1), { stdio: spawnStdio, ...optionsRest })
    : shell
      ? spawn(_command, { shell: true, stdio: spawnStdio, ...optionsRest })
      : (() => {
        const [command, ...args] = _command.split(' ')
        return spawn(command, args, { stdio: spawnStdio, ...optionsRest })
      })()

  const stdoutPromise = useInherit
    ? Promise.resolve(null)
    : streamToBuffer(childProcess.stdout, useSilent ? null : (chunk) => process.stdout.write(chunk))
  const stderrPromise = useInherit
    ? Promise.resolve(null)
    : streamToBuffer(childProcess.stderr, useSilent ? null : (chunk) => process.stderr.write(chunk))

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

export {
  run,
}
