import { colorLog } from './colorLog';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

colorLog('hello world', 'green');
colorLog(['hello', 'world'], ['red', 'boild', 'underline', 'yellow-bg']);

// 1. 普通日志（带换行）
colorLog('Task completed', 'green')

// 2. 进度输出（不换行）
colorLog('Loading', 'cyan', process.stdout.write)
colorLog('.', 'cyan', process.stdout.write)
colorLog('.', 'cyan', process.stdout.write)
colorLog('.', 'cyan', process.stdout.write)
colorLog('') // 最后换行

// 3. 错误输出到 stderr
colorLog('Error: ', 'red', process.stderr.write)
colorLog('Connection failed', ['red', 'boild'], process.stderr.write)
colorLog('') // 换行

// 4. 进度条效果
for (let i = 0; i <= 100; i += 10) {
  colorLog(`\rProgress: ${i}%`, 'green', process.stdout.write)
  await sleep(100)
}

colorLog('') // 完成后换行
