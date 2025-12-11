# 构建系统快速指南

## 🚀 快速开始

```bash
# 完整构建
npm run build

# 清理后构建
npm run rebuild
```

## ✨ 构建特性

✅ **TypeScript/JavaScript** → ESM 格式，轻度压缩  
✅ **.cjs/.mjs 文件** → 保持原格式，轻度压缩  
✅ **CSS 文件** → 直接复制  
✅ **保留变量名** → 调试友好  
✅ **保持文件结构** → 支持子路径导入  

## 📦 使用示例

```javascript
// 导入工具函数
import { isEqual } from '@bkou/core/data/isEqual'
import { isMobile } from '@bkou/core/browser/isMobile'

// 导入 ESLint 配置
import eslintConfig from '@bkou/core/eslint/__base__/eslint-config-base.cjs'

// 导入 CSS
import '@bkou/core/browser/css/reset.css'
```

## 📝 注意事项

**类型声明暂时关闭**
当前构建脚本中 `dts: false`，因为源码中有类型错误（`src/time/parse.ts`）。修复源码错误后可以启用类型声明生成：

```javascript
// scripts/build.js
dts: true,  // 改为 true
```

## 🔧 技术栈

- **tsup** - TypeScript 打包（基于 esbuild）
- **terser** - 代码压缩
- **glob** - 文件匹配

## 📖 完整文档

详细文档请查看：[docs/BUILD.md](./BUILD.md)

## ⚠️ 已知问题

1. 源码类型错误需要修复：
   - `src/time/parse.ts` - 缺少 `DateD8` 类型定义和 `offSet` 变量声明

2. 修复后即可启用类型声明生成

## 🎯 下一步

1. 修复源码类型错误
2. 启用 `dts: true`
3. 重新构建测试类型声明
