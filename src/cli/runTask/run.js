import { spawn } from 'child_process'

/**
 * @typedef {import('child_process').SpawnOptions} SpawnOptions
 * // inherit → 直接继承父进程的 stdio，但无法收集信息(default)
 * // collect → 收集且显示
 * // silent  → 收集但不显示
 * @typedef {'inherit' | 'collect' | 'silent'} IOMode
 * @typedef {SpawnOptions & { io?: IOMode }} RunOptions
 * @typedef {{
 *   code: number,
 *   signal: NodeJS.Signals,
 *   stdout: Buffer,
 *   stderr: Buffer
 * }} RunResult
 * @typedef {{
 *   childProcess: import('child_process').ChildProcess,
 *   promise: Promise<RunResult>,
 *   stdoutPromise: Promise<Buffer | null>,
 *   stderrPromise: Promise<Buffer | null>
 * }} RunReturn
 */

const isStreamReadable = (stream) => {
  return (
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function' &&
    stream.readable !== false
  )
}

/**
 * @param {NodeJS.ReadableStream} stream
 * @param {((chunk: Buffer) => void) | null} [onData]
 * @returns {Promise<Buffer>}
 */
const streamToBuffer = (stream, onData) => new Promise((resolve, reject) => {
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

/**
 * Run a command as a child process
 * @param {string | string[]} _command - Command to run (array or string)
 * @param {RunOptions} [_options={}] - Spawn options with additional io mode
 * @returns {RunReturn} Object containing childProcess, promise, stdoutPromise, stderrPromise
 */
const run = (_command, _options = {}) => {
  const { io = 'inherit', shell = false, ...optionsRest } = _options

  const useInherit = io === 'inherit'
  const useSilent = io === 'silent'
  const spawnStdio = useInherit ? 'inherit' : ['ignore', 'pipe', 'pipe']

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

  const promise = new Promise((resolve, reject) => {
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
