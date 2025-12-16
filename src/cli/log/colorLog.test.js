// ========== colorLog() 函数测试 ==========
import { colorLog } from './colorLog.js'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

colorLog('🧪 Testing colorLog() function\n', ['cyan', 'boild'])

// ========== 基础功能测试 ==========

colorLog('\n📋 测试 1: 无样式输出', ['cyan-bg'])
colorLog('Plain text output')

colorLog('\n📋 测试 2: 单一颜色', ['cyan-bg'])
colorLog('Red text', 'red')
colorLog('Green text', 'green')
colorLog('Cyan text', 'cyan')

colorLog('\n📋 测试 3: 单一样式', ['cyan-bg'])
colorLog('Bold text', 'boild')
colorLog('Italic text', 'italic')
colorLog('Underlined text', 'underline')

colorLog('\n📋 测试 4: 背景色', ['cyan-bg'])
colorLog('Yellow background', 'yellow-bg')
colorLog('Red background', 'red-bg')
colorLog('Cyan background', 'cyan-bg')

// ========== 组合样式测试 ==========

colorLog('\n📋 测试 5: 多重样式组合', ['cyan-bg'])
colorLog('Bold + Red', ['boild', 'red'])
colorLog('Italic + Green', ['italic', 'green'])
colorLog('Bold + Underline + Cyan', ['boild', 'underline', 'cyan'])
colorLog('Red + Yellow Background', ['red', 'yellow-bg'])

// ========== 数组输出测试 ==========

colorLog('\n📋 测试 6: 数组输出（块格式）', ['cyan-bg'])
colorLog(['Line 1', 'Line 2', 'Line 3'], ['green', 'boild'])

colorLog('\n📋 测试 7: 数组输出（带边框）', ['cyan-bg'])
colorLog([
  '多行消息测试',
  '这是第二行',
  '这是第三行',
], ['cyan', 'underline'])

// ========== 自定义输出流测试 ==========

colorLog('\n📋 测试 8: 输出到 stderr', ['cyan-bg'])
const writeErr = (text) => process.stderr.write(text)
colorLog('Error message', ['red', 'boild'], writeErr)
colorLog('Warning message', ['yellow', 'boild'], writeErr)
colorLog('') // 换行

colorLog('\n📋 测试 9: 不换行输出（进度条效果）', ['cyan-bg'])
const write = (text) => process.stdout.write(text)
colorLog('Loading', 'cyan', write)
await sleep(200)
colorLog('.', 'cyan', write)
await sleep(200)
colorLog('.', 'cyan', write)
await sleep(200)
colorLog('.', 'cyan', write)
await sleep(200)
colorLog('.', 'cyan', write)
await sleep(200)
colorLog(' Done!', 'green')

// ========== 边界情况测试 ==========

colorLog('\n📋 测试 10: 空字符串', ['cyan-bg'])
colorLog('', 'green')
colorLog('(上面应该有一个空的绿色输出)', 'cyan')

colorLog('\n📋 测试 11: 包含特殊字符', ['cyan-bg'])
colorLog('特殊字符: !@#$%^&*()_+-=[]{}|;:",.<>?/', 'magenta')
colorLog('Unicode: 你好 🎉 ✨ 🚀', 'blue')

colorLog('\n📋 测试 12: 长文本', ['cyan-bg'])
colorLog('A'.repeat(100), 'yellow')

// ========== 实际应用场景测试 ==========

colorLog('\n📋 测试 13: 模拟进度百分比', ['cyan-bg'])
for (let i = 0; i <= 100; i += 20) {
  colorLog(`\rProgress: ${i}%`, 'green', write)
  await sleep(150)
}
colorLog(' ✓', 'green')

colorLog('\n📋 测试 14: 模拟日志级别', ['cyan-bg'])
colorLog('[INFO] Application started', 'cyan')
colorLog('[SUCCESS] Task completed', 'green')
colorLog('[WARNING] Low memory', 'yellow')
colorLog('[ERROR] Connection failed', ['red', 'boild'])

colorLog('\n📋 测试 15: 模拟代码块输出', ['cyan-bg'])
colorLog([
  'function hello() {',
  '  console.log("Hello World")',
  '}',
], ['white', 'blue-bg'])

// ========== 颜色对比测试 ==========

colorLog('\n📋 测试 16: 所有颜色对比', ['cyan-bg'])
const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
colors.forEach(color => {
  colorLog(`${color} color`, color)
})

colorLog('\n📋 测试 17: 所有背景色对比', ['cyan-bg'])
const bgColors = ['black-bg', 'red-bg', 'green-bg', 'yellow-bg', 'blue-bg', 'magenta-bg', 'cyan-bg', 'white-bg']
bgColors.forEach(bg => {
  colorLog(`${bg} background`, bg)
})

colorLog('\n✅ 所有测试完成！', ['green', 'boild'])
