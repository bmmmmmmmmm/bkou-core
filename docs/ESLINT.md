# ESLint 配置文档

## 概述

`@bkou/core` 提供了一套开箱即用的 ESLint 配置，支持 JavaScript、TypeScript 和 React 项目。

---

## 目录结构

```
src/common/eslint/
├── __base__/           # 基础配置（JavaScript）
│   ├── eslint-config-base.cjs       # ESLint 8 配置
│   ├── eslint-config-base.flat.mjs  # ESLint 9+ Flat Config
│   └── rule-row-base.cjs            # 规则定义
├── __typescript__/     # TypeScript 配置
│   ├── eslint-config-ts.cjs
│   ├── eslint-config-ts.flat.mjs
│   └── rule-row-ts.cjs
└── __react__/          # React 配置
    ├── eslint-config-react.cjs
    ├── eslint-config-react.flat.mjs
    └── rule-row-react.cjs
```

---

## 配置说明

### 1. Base Config（基础配置）

**适用场景：** 纯 JavaScript 项目

**特性：**
- ✅ ES2021+ 语法支持
- ✅ Node.js 环境
- ✅ 浏览器全局变量（`window`、`document`、`navigator`）
- ✅ 支持 JSX 语法
- ✅ 集成插件：
  - `eslint-plugin-import` - 导入语句检查
  - `eslint-plugin-n` - Node.js 最佳实践
  - `eslint-plugin-promise` - Promise 使用规范

---

### 2. TypeScript Config

**适用场景：** TypeScript 项目

**特性：**
- ✅ 继承 Base Config
- ✅ TypeScript 特定规则
- ✅ 自动检测 `.ts`、`.tsx`、`.mts`、`.cts` 文件
- ✅ 使用 `@typescript-eslint/parser`
- ✅ 集成 `@typescript-eslint/eslint-plugin`

---

### 3. React Config

**适用场景：** React 项目

**特性：**
- ✅ 继承 Base Config
- ✅ React 特定规则
- ✅ React Hooks 规则检查
- ✅ 自动检测 `.jsx`、`.tsx` 文件
- ✅ 集成插件：
  - `eslint-plugin-react`
  - `eslint-plugin-react-hooks`

---

## 使用方法

### ESLint 8（传统配置）

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    '@bkou/core/common/eslint/__base__/eslint-config-base.cjs',
    '@bkou/core/common/eslint/__typescript__/eslint-config-ts.cjs',
    '@bkou/core/common/eslint/__react__/eslint-config-react.cjs',
  ],
};
```

### ESLint 9+（Flat Config）

```javascript
// eslint.config.mjs
import baseConfig from '@bkou/core/common/eslint/__base__/eslint-config-base.flat.mjs'
import tsConfig from '@bkou/core/common/eslint/__typescript__/eslint-config-ts.flat.mjs'
import reactConfig from '@bkou/core/common/eslint/__react__/eslint-config-react.flat.mjs'

export default [
  ...baseConfig,
  ...tsConfig,
  ...reactConfig,
]
```

> **提示：** 根据项目需求选择配置，不需要的可以删除。例如纯 JS 项目只需要 `baseConfig`

---

## 配置选项

### 自定义规则

如果你想覆盖某些规则：

**ESLint 8：**

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    '@bkou/core/common/eslint/__base__/eslint-config-base.cjs',
  ],
  rules: {
    // 覆盖规则
    'no-console': 'warn',
    'semi': ['error', 'always'],
  },
};
```

**ESLint 9+：**

```javascript
// eslint.config.mjs
import baseConfig from '@bkou/core/common/eslint/__base__/eslint-config-base.flat.mjs'

export default [
  ...baseConfig,
  {
    rules: {
      'no-console': 'warn',
      'semi': ['error', 'always'],
    },
  },
]
```

---

## 依赖要求

使用这些配置需要安装以下依赖：

### Base Config 依赖

```bash
npm install -D eslint eslint-plugin-import eslint-plugin-n eslint-plugin-promise
```

### TypeScript Config 额外依赖

```bash
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript
```

### React Config 额外依赖

```bash
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

---

## 完整安装示例

### TypeScript 项目完整依赖

```bash
npm install -D \
  eslint \
  eslint-plugin-import \
  eslint-plugin-n \
  eslint-plugin-promise \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  typescript
```

### React + TypeScript 项目完整依赖

```bash
npm install -D \
  eslint \
  eslint-plugin-import \
  eslint-plugin-n \
  eslint-plugin-promise \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  typescript \
  eslint-plugin-react \
  eslint-plugin-react-hooks
```

---

## 更新日志

### v0.0.1
- ✨ 首次发布
- ✅ 支持 ESLint 8 和 ESLint 9+
- ✅ 提供 Base、TypeScript、React 三套配置
- ✅ 同时提供传统配置和 Flat Config 两种格式
