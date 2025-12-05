# 构建系统文档

## 概述

本项目使用 **tsup + 自定义构建脚本** 进行打包，支持：

- ✅ TypeScript/JavaScript 编译为 ESM 格式
- ✅ 生成类型声明文件（.d.ts）
- ✅ 轻度代码压缩（保留变量名和函数名）
- ✅ .cjs/.mjs 文件保持原格式并压缩
- ✅ CSS 文件直接复制
- ✅ 保持源码文件结构
- ✅ 支持子路径导入

---

## 构建命令

```bash
# 完整构建
npm run build

# 清理 + 构建
npm run rebuild

# 清理 dist 目录
npm run clear:dist
```

---

## 构建流程

### 1. 清理阶段
删除旧的 `dist/` 目录

### 2. TypeScript/JavaScript 编译
- **工具**: tsup (基于 esbuild)
- **输入**: `src/**/*.{ts,js}`
- **输出**: `dist/**/*.js` + `dist/**/*.d.ts`
- **格式**: ESM
- **压缩**: 轻度压缩，保留变量名和函数名

### 3. CJS/MJS 文件处理
- **输入**: `src/**/*.{cjs,mjs}`
- **处理**: 使用 terser 压缩（保留变量名）
- **输出**: 保持原格式（.cjs 还是 .cjs，.mjs 还是 .mjs）

### 4. CSS 文件复制
- **输入**: `src/**/*.css`
- **处理**: 直接复制，不压缩
- **输出**: `dist/**/*.css`

---

## 文件结构

### 构建前（src/）
```
src/
  browser/
    isMobile.ts
    css/
      reset.css
  common/
    data/
      isEqual.ts
    eslint/
      eslint-config-base.cjs
      eslint-config-base.flat.mjs
```

### 构建后（dist/）
```
dist/
  browser/
    isMobile.js          (ESM, 压缩)
    isMobile.d.ts        (类型声明)
    css/
      reset.css          (原样)
  common/
    data/
      isEqual.js         (ESM, 压缩)
      isEqual.d.ts       (类型声明)
    eslint/
      eslint-config-base.cjs      (CJS, 压缩)
      eslint-config-base.flat.mjs (ESM, 压缩)
```

---

## 使用方式

### 安装
```bash
npm install @bkou/core
```

### 导入示例

#### 导入 TypeScript 编译的模块
```javascript
// 从子路径导入
import { isEqual } from '@bkou/core/common/data/isEqual'
import { isMobile } from '@bkou/core/browser/isMobile'
```

#### 导入 ESLint 配置
```javascript
// CommonJS 格式
import eslintConfig from '@bkou/core/common/eslint/eslint-config-base.cjs'

// ESM 格式
import eslintConfigFlat from '@bkou/core/common/eslint/eslint-config-base.flat.mjs'
```

#### 导入 CSS
```javascript
import '@bkou/core/browser/css/reset.css'
```

---

## 配置文件

### tsup.config.ts
tsup 的配置文件，定义了 TypeScript/JavaScript 的编译规则。

**关键配置：**
- `entry`: 匹配所有 `.ts` 和 `.js` 文件
- `format`: 输出 ESM 格式
- `dts`: 生成类型声明
- `minify`: 使用 terser 压缩
- `mangle: false`: 保留变量名（保持可读性）

### scripts/build.js
自定义构建脚本，协调整个构建流程。

**主要功能：**
1. 调用 tsup 编译 TypeScript/JavaScript
2. 使用 terser 压缩 .cjs/.mjs 文件
3. 复制 CSS 文件

---

## 技术栈

| 工具 | 用途 | 说明 |
|------|------|------|
| **tsup** | TypeScript 打包 | 基于 esbuild，速度极快 |
| **terser** | 代码压缩 | 压缩 cjs/mjs 文件 |
| **glob** | 文件匹配 | 查找特定扩展名的文件 |
| **esbuild** | 底层编译 | tsup 的底层引擎 |

---

## 压缩策略

### 轻度压缩
所有文件都采用轻度压缩策略：

**开启：**
- ✅ 删除注释
- ✅ 删除多余空格
- ✅ 简化语法（如 `return false` → `return!1`）

**关闭：**
- ❌ 不混淆变量名（保留 `isEqual`、`a`、`b` 等）
- ❌ 不混淆函数名

**效果对比：**

```javascript
// 原始代码
export function isEqual(a, b) {
  if (typeof a !== typeof b) {
    return false
  }
  return a === b
}

// 压缩后（保留可读性）
export function isEqual(a,b){if(typeof a!==typeof b)return!1;return a===b}
```

**优点：**
- 体积减少 30-40%
- 依然可读，调试友好
- 报错信息清晰

---

## 子路径导入配置

`package.json` 的 `exports` 字段配置：

```json
{
  "exports": {
    "./browser/*": "./dist/browser/*.js",
    "./common/*": "./dist/common/*.js",
    "./package.json": "./package.json"
  }
}
```

**支持的导入方式：**
- `@bkou/core/browser/isMobile`
- `@bkou/core/common/data/isEqual`
- `@bkou/core/common/color/trans`

---

## 开发建议

### 添加新的源文件类型
如果需要处理新的文件类型（如 `.json`、`.wasm`），修改 `scripts/build.js`：

```javascript
// 添加 JSON 文件复制
const jsonFiles = await glob('src/**/*.json')
for (const file of jsonFiles) {
  const destPath = file.replace('src/', 'dist/')
  const destDir = path.dirname(destPath)
  await mkdir(destDir, { recursive: true })
  await cp(file, destPath)
}
```

### 修改压缩策略
如果需要更激进的压缩（混淆变量名），修改 `terserOptions`：

```javascript
terserOptions: {
  compress: true,
  mangle: true,  // 改为 true，会混淆变量名
}
```

### 支持多种模块格式
如果需要同时输出 ESM 和 CJS，修改 tsup 配置：

```javascript
format: ['esm', 'cjs']  // 会生成 .js 和 .cjs
```

---

## 常见问题

### Q: 为什么选择 tsup？
A: tsup 基于 esbuild，速度极快（比 tsc 快 10-20 倍），配置简单，专为库打包设计。

### Q: 为什么不直接用 tsc？
A: tsc 不支持代码压缩，速度较慢，配置相对复杂。

### Q: 为什么 .cjs 和 .mjs 要单独处理？
A: 这些文件已经是编译好的 JavaScript，不需要 TypeScript 编译，但需要压缩以减小体积。

### Q: 构建后的代码可读吗？
A: 可以。我们使用轻度压缩，保留了所有变量名和函数名，只是去掉了空格和注释。

### Q: 如何调试构建问题？
A: 查看构建脚本的输出日志，或者手动运行：
```bash
node scripts/build.js
```

---

## 性能

**构建速度（估计）：**
- 小型项目（< 50 文件）: < 1 秒
- 中型项目（50-200 文件）: 1-3 秒
- 大型项目（> 200 文件）: 3-10 秒

**对比：**
- tsc: 5-30 秒（同等项目）
- tsup: 0.5-10 秒

---

## 维护

### 更新依赖
```bash
npm update tsup terser glob
```

### 检查过时的依赖
```bash
npm outdated
```
