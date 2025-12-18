import { run } from './run.js'

const runSilent = async (cmd) => await run(cmd, { io: 'silent' }).promise

const runResult = async (cmd) => (await run(cmd, { io: 'silent' }).promise).stdout.toString().trim()

const runStdResult = async (cmd) => (await run(cmd, { io: 'collect' }).promise).stdout.toString().trim()

export {
  run,
  runSilent, runResult, runStdResult,
}
