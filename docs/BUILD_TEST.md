# 测试构建文档

## 概述

`build_test.js` 用于将 TypeScript 测试文件编译为可直接运行的 JavaScript，便于调试和快速测试。

## 快速开始

```bash
# 编译所有测试文件
npm run build:test

# 运行单个测试
node output_test/cli/log/colorLog.test.js

# 运行所有测试
for file in output_test/**/*.test.js; do node "$file"; done
```

## 为什么需要测试构建？

### 问题：TypeScript 测试无法直接运行

```bash
# ❌ 无法直接运行 .ts 文件
node src/cli/runTask/run.test.ts
# Error: Unknown file extension ".ts"

# 需要额外工具
tsx src/cli/runTask/run.test.ts        # 需要安装 tsx
ts-node src/cli/runTask/run.test.ts    # 需要安装 ts-node
```

### 解决方案：预编译测试文件

```bash
# 1. 编译测试文件
npm run build:test

# 2. 直接运行编译后的 .js
node output_test/cli/runTask/run.test.js  # ✅ 可以运行
```

## 构建流程

### 步骤 1：查找测试文件

```javascript
const testFiles = await glob('src/**/*.test.{ts,js}', {
  ignore: ['**/__tests__/**', '**/__test__/**'],
})
```

**查找规则：**
- 匹配 `*.test.ts` 和 `*.test.js`
- 扫描 `src/` 下所有子目录
- 排除 `__tests__` 和 `__test__` 目录

**找到的文件示例：**
```
src/cli/runTask/run.test.ts
src/cli/log/colorLog.test.ts
```

### 步骤 2：编译测试文件

```javascript
await build({
  entry: testFiles,
  format: ['esm'],
  outDir: 'output_test',
  splitting: true,    // 🔑 关键：代码拆分
  clean: true,
  minify: false,      // 🔑 关键：不压缩
  sourcemap: true,    // 🔑 关键：生成 sourcemap
  dts: false,
})
```

**输出结果：**
```
output_test/
  chunk-ABC123.js              ← 共享依赖（colorLog、run 等）
  chunk-DEF456.js              ← 其他共享模块
  cli/
    log/
      colorLog.test.js         ← 编译后的测试
      colorLog.test.js.map     ← sourcemap 文件
    runTask/
      run.test.js
      run.test.js.map
```

### 步骤 3：显示运行提示

```bash
💡 运行测试:
   node output_test/cli/log/colorLog.test.js
   node output_test/cli/runTask/run.test.js

💡 或运行所有测试:
   node output_test/**/*.test.js
```

## 关键配置详解

### splitting: true - 代码拆分

**为什么需要代码拆分？**

假设两个测试文件都导入了 `colorLog`：

```typescript
// run.test.ts
import { colorLog } from '../log/colorLog.js'

// colorLog.test.ts
import { colorLog } from './colorLog.js'
```

**未启用 splitting（问题）：**
```javascript
// output_test/cli/runTask/run.test.js
var logStyleMap = new Map([...])  // colorLog 完整实现（~50 行）
var colorLog = (params, style) => { ... }
// 测试代码...

// output_test/cli/log/colorLog.test.js
var logStyleMap = new Map([...])  // 又一遍 colorLog（重复！）
var colorLog = (params, style) => { ... }
// 测试代码...
```

**启用 splitting（解决）：**
```javascript
// output_test/chunk-ABC123.js
var logStyleMap = new Map([...])  // colorLog 只存在一份
var colorLog = (params, style) => { ... }
export { colorLog }

// output_test/cli/runTask/run.test.js
import { colorLog } from '../../chunk-ABC123.js'  // 引用共享模块
// 测试代码...

// output_test/cli/log/colorLog.test.js
import { colorLog } from '../../chunk-ABC123.js'  // 引用共享模块
// 测试代码...
```

**效果对比：**

| 指标 | splitting: false | splitting: true |
|-----|------------------|-----------------|
| colorLog.test.js | 120 行 | 60 行 |
| run.test.js | 187 行 | 120 行 |
| **总体积** | 307 行 | 230 行（含 chunk） |
| **重复代码** | ❌ 有 | ✅ 无 |

### minify: false - 不压缩

**为什么测试文件不压缩？**

#### 1. 控制台输出难以阅读

**压缩后：**
```javascript
console.log("✓ 测试通过"),colorLog("找到 2 个文件","green"),await sleep(100);
// ↑ 所有输出挤在一行
```

**不压缩：**
```javascript
console.log("✓ 测试通过")
colorLog("找到 2 个文件", "green")
await sleep(100)
// ↑ 清晰明了
```

#### 2. 错误堆栈更清晰

**压缩后：**
```
Error: Test failed
    at a(run.test.js:1:234)
    at async b(run.test.js:1:567)
```

**不压缩：**
```
Error: Test failed
    at run.test.js:15:8
    at async main (run.test.js:42:3)
```

#### 3. 调试时可以直接看代码

**压缩后：**
```javascript
const{stdout}=await run(["echo","test"]).promise;console.log(stdout.toString());
```

**不压缩：**
```javascript
const { stdout } = await run(["echo", "test"]).promise
console.log(stdout.toString())
```

#### 4. 测试文件不需要优化体积

| 特性 | 生产代码 (dist/) | 测试代码 (output_test/) |
|-----|-----------------|------------------------|
| **运行环境** | 用户项目 | 开发环境 |
| **体积要求** | 越小越好 | 无关紧要 |
| **可读性** | 不重要 | 非常重要 |
| **调试频率** | 很少 | 经常 |
| **minify** | ✅ 必须 | ❌ 不要 |

### sourcemap: true - 生成源码映射

**什么是 sourcemap？**

Sourcemap 记录了编译前后代码的对应关系，让你在调试时能看到**原始的 TypeScript 代码**。

**示例：**

```typescript
// src/cli/runTask/run.test.ts (原始代码)
const { stdout } = await run(['echo', 'test']).promise
console.log(stdout.toString())  // ← 假设这里报错
```

编译后：

```javascript
// output_test/cli/runTask/run.test.js (编译后)
const { stdout } = await run(["echo", "test"]).promise;
console.log(stdout.toString());

// output_test/cli/runTask/run.test.js.map (sourcemap)
{
  "mappings": "AAAA,MAAM,CAAC,MAAM...",
  "sources": ["../../../src/cli/runTask/run.test.ts"],
  ...
}
```

**调试效果：**

**没有 sourcemap：**
```bash
node output_test/cli/runTask/run.test.js
# 报错：
# Error at output_test/cli/runTask/run.test.js:15
# 看到的是编译后的 JavaScript
```

**有 sourcemap：**
```bash
node output_test/cli/runTask/run.test.js
# 报错：
# Error at src/cli/runTask/run.test.ts:15:8
#     at async main (src/cli/runTask/run.test.ts:42:3)
# 看到的是原始的 TypeScript！
```

### dts: false - 不生成类型声明

测试文件不需要类型声明，因为：
- 测试代码不会被其他模块导入
- 生成 `.d.ts` 只会浪费构建时间
- 测试文件本身已经有类型（在 `.test.ts` 中）

## 运行测试

### 单个测试

```bash
# 运行特定测试
node output_test/cli/log/colorLog.test.js
node output_test/cli/runTask/run.test.js
```

### 批量运行

**Bash/Zsh：**
```bash
for file in output_test/**/*.test.js; do
  echo "Running $file"
  node "$file"
done
```

**使用 find：**
```bash
find output_test -name "*.test.js" -exec node {} \;
```

**Zsh 通配符（需要开启 globstar）：**
```bash
setopt globstar
node output_test/**/*.test.js
```

### 与 npm test 的区别

| 命令 | 用途 | 工具 |
|-----|------|------|
| `npm run build:test` | 编译测试文件 | tsup |
| `npm test` | 运行测试框架 | jest/vitest |

`build:test` 是**独立于测试框架**的，只负责编译，不运行测试。适合：
- 快速验证单个测试
- 调试测试代码
- CI 环境中的轻量级测试

## 目录结构

### 输入（源码）

```
src/
  cli/
    log/
      colorLog.ts
      colorLog.test.ts      ← 测试文件
    runTask/
      run.ts
      run.test.ts           ← 测试文件
```

### 输出（编译后）

```
output_test/
  chunk-ABC123.js           ← 共享模块（colorLog 实现）
  chunk-ABC123.js.map
  chunk-DEF456.js           ← 共享模块（run 实现）
  chunk-DEF456.js.map
  cli/
    log/
      colorLog.test.js      ← 编译后的测试
      colorLog.test.js.map  ← sourcemap
    runTask/
      run.test.js
      run.test.js.map
```

## 与生产构建的对比

### build.js vs build_test.js

| 配置项 | build.js | build_test.js | 原因 |
|-------|----------|---------------|------|
| **入口** | 源码（排除测试） | 仅测试文件 | 不同目标 |
| **输出** | `dist/` | `output_test/` | 分离产物 |
| **splitting** | ❌ | ✅ | 测试需要共享代码 |
| **clean** | ❌（手动清理） | ✅ | 单步骤可以自动清理 |
| **minify** | ✅ terser | ❌ | 生产压缩，测试保持可读 |
| **sourcemap** | ❌ | ✅ | 测试需要调试 |
| **dts** | ✅（仅 .ts） | ❌ | 测试不需要类型声明 |

### 为什么不合并到 build.js？

1. **构建目标不同**
   - `build.js` → 发布到 npm
   - `build_test.js` → 本地调试

2. **配置冲突**
   - 生产代码需要压缩
   - 测试代码需要可读

3. **输出目录分离**
   - `dist/` 会被发布
   - `output_test/` 只在本地

4. **灵活性**
   - 可以独立运行测试构建
   - 不影响生产构建

## 常见问题

### Q1: 为什么不用 ts-node 或 tsx？

**A:** 
- `ts-node` / `tsx` 是运行时编译，每次运行都要重新编译
- `build_test.js` 是预编译，编译一次，多次运行
- 预编译更快，适合频繁调试

**对比：**
```bash
# 运行时编译（慢）
tsx src/cli/runTask/run.test.ts  # 每次都编译

# 预编译（快）
npm run build:test                         # 只编译一次
node output_test/cli/runTask/run.test.js   # 直接运行
node output_test/cli/runTask/run.test.js   # 直接运行
```

### Q2: chunk 文件是什么？

**A:** chunk 是 tsup 代码拆分（splitting）生成的共享模块文件。

```javascript
// chunk-ABC123.js
export var colorLog = (params, style) => { ... }

// colorLog.test.js
import { colorLog } from '../../chunk-ABC123.js'

// run.test.js
import { colorLog } from '../../chunk-ABC123.js'
```

多个测试文件共享同一个 colorLog 实现，避免代码重复。

### Q3: 可以不生成 sourcemap 吗？

**A:** 可以，但**强烈不推荐**。

```javascript
sourcemap: false  // 不生成 sourcemap
```

后果：
- ❌ 报错时只能看到编译后的 JS 代码
- ❌ 错误堆栈指向编译后的文件
- ❌ 调试体验极差

**结论：** 测试文件务必保持 `sourcemap: true`。

### Q4: 可以压缩测试文件吗？

**A:** 技术上可以，但**不应该**。

```javascript
minify: true  // ❌ 不推荐
```

即使有 sourcemap，压缩后：
- 控制台输出难以阅读（所有语句挤在一行）
- 错误堆栈信息混乱
- 直接打开 `.js` 文件查看代码困难

**结论：** 测试文件永远不要压缩。

### Q5: 可以改成输出到 test/ 目录吗？

**A:** 可以，修改 `outDir`：

```javascript
outDir: 'test',  // 改成 test/
```

但要注意：
- package.json 的 `files` 字段可能需要添加 `!test` 排除
- `.gitignore` 需要添加 `/test`
- 运行命令改为 `node test/**/*.test.js`

**建议：** 使用独立的 `output_test/` 目录，避免和其他工具冲突。

### Q6: 为什么有时候测试会报找不到模块？

**A:** 可能原因：

1. **相对路径错误**
   ```javascript
   // ❌ 错误：test 目录结构和 src 不同
   import { run } from './run.js'
   
   // ✅ 正确：使用相对于 output_test 的路径
   import { run } from '../output_test/cli/runTask/run.js'
   ```

2. **依赖未编译**
   ```bash
   # 需要先构建生产代码
   npm run build
   # 再构建测试
   npm run build:test
   ```

3. **chunk 文件被删除**
   ```bash
   # 不要手动删除 chunk 文件
   rm output_test/chunk-*.js  # ❌
   ```

### Q7: 编译很慢怎么办？

**A:** 测试编译通常很快（< 1 秒），如果慢：

1. **减少入口文件数量**
   ```javascript
   // 只编译特定测试
   const testFiles = ['src/cli/runTask/run.test.ts']
   ```

2. **禁用 sourcemap**（不推荐）
   ```javascript
   sourcemap: false
   ```

3. **使用增量编译**（tsup 不支持，考虑用 tsc）

## 扩展阅读

- [tsup 文档 - Code Splitting](https://tsup.egoist.dev/#code-splitting)
- [Sourcemap 原理](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
- [为什么不要压缩测试代码](https://kentcdodds.com/blog/optimize-for-change)
- [Node.js ES Modules](https://nodejs.org/api/esm.html)
