const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 查找项目中所有 aka.doubaocdn.com URL
 * 并生成报告和替换脚本
 */

const SEARCH_PATTERN = 'aka\\.doubaocdn\\.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'aka-url-reports');
const SOURCE_DIR = path.join(__dirname, '..');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('正在搜索 aka.doubaocdn.com URL...\n');

try {
  // 使用 grep 搜索所有匹配项
  const grepCommand = `grep -rn "${SEARCH_PATTERN}" ${SOURCE_DIR} --include="*.html" --include="*.jsx" --include="*.js" --include="*.tsx" --include="*.ts" --include="*.css" --include="*.scss" || true`;
  const results = execSync(grepCommand, { encoding: 'utf-8' });

  const lines = results.trim().split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    console.log('没有找到任何 aka.doubaocdn.com URL');
    process.exit(0);
  }

  console.log(`找到 ${lines.length} 个匹配项\n`);

  // 解析结果
  const urlMap = new Map(); // 按文件分组
  const uniqueUrls = new Set();

  lines.forEach(line => {
    const [filePath, lineNum, ...contentParts] = line.split(':');
    const content = contentParts.join(':').trim();

    // 提取 URL
    const urlMatch = content.match(/https:\/\/aka\.doubaocdn\.com\/[^\s"']+/);
    if (urlMatch) {
      const url = urlMatch[0];
      uniqueUrls.add(url);

      if (!urlMap.has(filePath)) {
        urlMap.set(filePath, []);
      }

      urlMap.get(filePath).push({
        line: parseInt(lineNum),
        url: url,
        content: content.trim()
      });
    }
  });

  // 1. 生成详细报告
  const reportPath = path.join(OUTPUT_DIR, 'aka-urls-report.txt');
  let reportContent = 'AKA URL 查找报告\n';
  reportContent += '生成时间: ' + new Date().toLocaleString('zh-CN') + '\n';
  reportContent += '项目路径: ' + SOURCE_DIR + '\n\n';
  reportContent += '统计信息:\n';
  reportContent += '- 总文件数: ' + urlMap.size + '\n';
  reportContent += '- 总 URL 数: ' + lines.length + '\n';
  reportContent += '- 唯一 URL 数: ' + uniqueUrls.size + '\n\n';
  reportContent += '=== 按文件分组 ===\n\n';

  urlMap.forEach((items, filePath) => {
    reportContent += '文件: ' + filePath + '\n';
    reportContent += '   找到 ' + items.length + ' 个 URL:\n\n';

    items.forEach(item => {
      reportContent += '   第 ' + item.line + ' 行:\n';
      reportContent += '   URL: ' + item.url + '\n';
      const preview = item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content;
      reportContent += '   内容: ' + preview + '\n\n';
    });

    reportContent += '\n' + '='.repeat(80) + '\n\n';
  });

  fs.writeFileSync(reportPath, reportContent, 'utf-8');
  console.log('详细报告已生成: ' + reportPath);

  // 2. 生成 CSV 格式报告（方便 Excel 打开）
  const csvPath = path.join(OUTPUT_DIR, 'aka-urls-report.csv');
  let csvContent = '文件路径,行号,URL,内容预览\n';

  urlMap.forEach((items, filePath) => {
    items.forEach(item => {
      const content = item.content.replace(/"/g, '""').replace(/,/g, '，').substring(0, 50);
      csvContent += '"' + filePath + '",' + item.line + ',"' + item.url + '","' + content + '"\n';
    });
  });

  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log('CSV 报告已生成: ' + csvPath);

  // 3. 生成所有唯一 URL 列表
  const urlsPath = path.join(OUTPUT_DIR, 'unique-aka-urls.txt');
  const sortedUrls = Array.from(uniqueUrls).sort();
  fs.writeFileSync(urlsPath, sortedUrls.join('\n') + '\n', 'utf-8');
  console.log('唯一 URL 列表已生成: ' + urlsPath);

  // 4. 生成 JSON 格式的映射文件
  const jsonPath = path.join(OUTPUT_DIR, 'aka-urls-mapping.json');
  const mapping = {};
  sortedUrls.forEach(url => {
    mapping[url] = '';
  });
  fs.writeFileSync(jsonPath, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log('JSON 映射文件已生成: ' + jsonPath);

  // 5. 生成替换脚本
  const scriptPath = path.join(OUTPUT_DIR, 'replace-urls.js');
  const scriptContent = 'const fs = require(\'fs\');\n' +
    'const path = require(\'path\');\n\n' +
    '// URL 映射关系 - 请填写新的 URL\n' +
    'const replacementMap = ' + JSON.stringify(mapping, null, 2) + ';\n\n' +
    '// 需要替换的文件列表\n' +
    'const filesToReplace = [\n' +
    Array.from(urlMap.keys()).map(file => '  \'' + file.replace(SOURCE_DIR + '/', '') + '\'').join(',\n') + '\n' +
    '];\n\n' +
    'console.log(\'开始替换 AKA URLs...\');\n\n' +
    'let totalReplaced = 0;\n\n' +
    'filesToReplace.forEach(function(filePath) {\n' +
    '  const fullPath = path.join(__dirname, \'..\', filePath);\n\n' +
    '  if (!fs.existsSync(fullPath)) {\n' +
    '    console.log(\'文件不存在: \' + filePath);\n' +
    '    return;\n' +
    '  }\n\n' +
    '  let content = fs.readFileSync(fullPath, \'utf-8\');\n' +
    '  let fileReplaced = 0;\n\n' +
    '  Object.entries(replacementMap).forEach(function(entry) {\n' +
    '    const oldUrl = entry[0];\n' +
    '    const newUrl = entry[1];\n\n' +
    '    if (!newUrl) {\n' +
    '      return;\n' +
    '    }\n\n' +
    '    const escapedUrl = oldUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, \'\\\\\\\\$&\');\n' +
    '    const regex = new RegExp(escapedUrl, \'g\');\n' +
    '    const matches = content.match(regex);\n' +
    '    if (matches) {\n' +
    '      content = content.replace(regex, newUrl);\n' +
    '      fileReplaced += matches.length;\n' +
    '      totalReplaced += matches.length;\n' +
    '    }\n' +
    '  });\n\n' +
    '  if (fileReplaced > 0) {\n' +
    '    fs.writeFileSync(fullPath, content, \'utf-8\');\n' +
    '    console.log(filePath + \': 替换了 \' + fileReplaced + \' 个 URL\');\n' +
    '  }\n' +
    '});\n\n' +
    'console.log(\'\\n完成! 总共替换了 \' + totalReplaced + \' 个 URL\');\n';

  fs.writeFileSync(scriptPath, scriptContent, 'utf-8');
  console.log('替换脚本已生成: ' + scriptPath);

  // 6. 输出摘要
  console.log('\n' + '='.repeat(80));
  console.log('摘要:');
  console.log('   - 找到 ' + lines.length + ' 个 AKA URL');
  console.log('   - 分布在 ' + urlMap.size + ' 个文件中');
  console.log('   - 共有 ' + uniqueUrls.size + ' 个唯一 URL');
  console.log('\n所有报告已保存到:');
  console.log('   ' + OUTPUT_DIR);
  console.log('\n生成的文件:');
  console.log('   1. aka-urls-report.txt  - 详细报告');
  console.log('   2. aka-urls-report.csv  - CSV 格式（可用 Excel 打开）');
  console.log('   3. unique-aka-urls.txt  - 唯一 URL 列表');
  console.log('   4. aka-urls-mapping.json - JSON 格式映射文件');
  console.log('   5. replace-urls.js      - 替换脚本');
  console.log('\n下一步:');
  console.log('   1. 查看报告了解详情');
  console.log('   2. 编辑 aka-urls-mapping.json，填写新的 URL');
  console.log('   3. 更新 replace-urls.js 使用映射文件');
  console.log('   4. 运行 node aka-url-reports/replace-urls.js 执行批量替换');
  console.log('='.repeat(80) + '\n');

} catch (error) {
  console.error('执行出错:', error.message);
  process.exit(1);
}
