# AKA URL 替换方案说明

本目录包含了查找和替换项目中 `aka.doubaocdn.com` URL 的所有工具和报告。

## 📊 统计信息

- **总 URL 数量**: 138 个
- **分布文件数**: 13 个文件
- **唯一 URL 数**: 50 个

## 📁 生成的文件

### 1. `aka-urls-report.txt`
详细的文本报告，包含每个文件中每个 URL 的具体位置（行号）和上下文内容。

### 2. `aka-urls-report.csv`
CSV 格式的报告，可以用 Excel 或其他表格软件打开查看。

**列说明**:
- 文件路径
- 行号
- URL
- 内容预览

### 3. `unique-aka-urls.txt`
所有唯一的 AKA URL 列表，每行一个 URL。

### 4. `aka-urls-mapping.json`
JSON 格式的 URL 映射文件，用于配置旧 URL 到新 URL 的映射关系。

**格式**:
```json
{
  "https://aka.doubaocdn.com/s/xxxxx": "新的 URL",
  ...
}
```

### 5. `replace-urls.js`
自动生成的替换脚本，用于批量替换 URL。

## 🚀 使用步骤

### 第一步：查看报告
```bash
# 查看详细报告
cat aka-url-reports/aka-urls-report.txt

# 或用 Excel 打开 CSV 报告
open aka-url-reports/aka-urls-report.csv
```

### 第二步：配置 URL 映射
编辑 `aka-urls-mapping.json` 文件，为每个旧 URL 配对应的新 URL：

```json
{
  "https://aka.doubaocdn.com/s/Z0h91vjxpI": "https://your-new-os-platform.com/new-path-1.jpg",
  "https://aka.doubaocdn.com/s/g8U01vjxpH": "https://your-new-os-platform.com/new-path-2.jpg",
  ...
}
```

### 第三步：更新替换脚本
编辑 `replace-urls.js`，确保它使用了 `aka-urls-mapping.json` 中的映射：

```javascript
// 在 replace-urls.js 顶部添加
const mapping = require('./aka-urls-mapping.json');
const replacementMap = mapping;
```

### 第四步：执行替换
```bash
node aka-url-reports/replace-urls.js
```

## 📝 涉及的文件

替换操作会影响以下 13 个文件：

1. `public/static/talent/education_experts.html` - 6 个 URL
2. `public/static/talent/integrated_apple_style.html` - 6 个 URL
3. `public/static/talent/construction_team.html` - 6 个 URL
4. `public/static/talent/engineer_team.html` - 6 个 URL
5. `public/static/product-library/final_gallery.html` - 29 个 URL
6. `public/static/talent/design_team.html` - 6 个 URL
7. `src/pages/ProductGallery.jsx` - 79 个 URL

## 🔧 重新运行查找脚本

如果需要更新报告（例如代码有新的修改）：

```bash
node scripts/find-aka-urls.cjs
```

## ⚠️ 注意事项

1. **备份代码**: 在执行替换前，建议先提交当前代码到 Git，以便出现问题时可以回滚
2. **测试验证**: 替换完成后，务必测试所有图片和资源是否正常加载
3. **URL 映射**: 确保 new URL 格式正确，且资源已经上传到新的 OS 存储平台
4. **分批替换**: 如果担心出错，可以先替换几个文件测试，确认无误后再批量替换

## 📋 快速命令参考

```bash
# 查找所有 AKA URL
node scripts/find-aka-urls.cjs

# 查看特定文件中的 URL（示例）
grep -n "aka.doubaocdn.com" public/static/talent/design_team.html

# 执行替换（配置完映射后）
node aka-url-reports/replace-urls.js

# 查看替换结果
git diff

# 如果需要撤销替换
git checkout .
```
