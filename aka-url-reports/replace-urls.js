const fs = require('fs');
const path = require('path');

// URL 映射关系 - 请填写新的 URL
const replacementMap = {
  "https://aka.doubaocdn.com/s/0ctx1vkhSK": "",
  "https://aka.doubaocdn.com/s/1Ouj1vjxpI": "",
  "https://aka.doubaocdn.com/s/2nJ91vjxpI": "",
  "https://aka.doubaocdn.com/s/40al1vkhVH": "",
  "https://aka.doubaocdn.com/s/5Ebr1vjxsv": "",
  "https://aka.doubaocdn.com/s/6k4w1vkhPO": "",
  "https://aka.doubaocdn.com/s/8RSk1vjxsu": "",
  "https://aka.doubaocdn.com/s/8WXG1vkcsz": "",
  "https://aka.doubaocdn.com/s/DWVb1vkcsz": "",
  "https://aka.doubaocdn.com/s/EotV1vkgzj": "",
  "https://aka.doubaocdn.com/s/GUgR1vkcno": "",
  "https://aka.doubaocdn.com/s/HxGO1vkhSK": "",
  "https://aka.doubaocdn.com/s/IhD01vjxsu": "",
  "https://aka.doubaocdn.com/s/L7gu1vkcnq": "",
  "https://aka.doubaocdn.com/s/OYnc1vkhPO": "",
  "https://aka.doubaocdn.com/s/PvWH1vkhPN": "",
  "https://aka.doubaocdn.com/s/RDyR1vkcsz": "",
  "https://aka.doubaocdn.com/s/SGVh1vkhPO": "",
  "https://aka.doubaocdn.com/s/Sy6m1vkctK": "",
  "https://aka.doubaocdn.com/s/TEKW1vkcnp": "",
  "https://aka.doubaocdn.com/s/Tx351vkcnv": "",
  "https://aka.doubaocdn.com/s/Uy161vjxsv": "",
  "https://aka.doubaocdn.com/s/WIOD1vkgzi": "",
  "https://aka.doubaocdn.com/s/XeTd1vjxkH": "",
  "https://aka.doubaocdn.com/s/YThE1vkhPN": "",
  "https://aka.doubaocdn.com/s/Ytop1vjxsu": "",
  "https://aka.doubaocdn.com/s/Z0h91vjxpI": "",
  "https://aka.doubaocdn.com/s/aPpx1vkgzi": "",
  "https://aka.doubaocdn.com/s/bnnk1vkcsy": "",
  "https://aka.doubaocdn.com/s/e1nF1vjxpI": "",
  "https://aka.doubaocdn.com/s/esjp1vkhVG": "",
  "https://aka.doubaocdn.com/s/f5531vjxpK": "",
  "https://aka.doubaocdn.com/s/g8U01vjxpH": "",
  "https://aka.doubaocdn.com/s/gSI31vkhVG": "",
  "https://aka.doubaocdn.com/s/gUwu1vkgzi": "",
  "https://aka.doubaocdn.com/s/is371vkcnz": "",
  "https://aka.doubaocdn.com/s/jsBn1vkhSJ": "",
  "https://aka.doubaocdn.com/s/kUyu1vkhPO": "",
  "https://aka.doubaocdn.com/s/njid1vkhVG": "",
  "https://aka.doubaocdn.com/s/o0FZ1vkhVF": "",
  "https://aka.doubaocdn.com/s/pTfj1vjxsu": "",
  "https://aka.doubaocdn.com/s/paxw1vkcnq": "",
  "https://aka.doubaocdn.com/s/pduo1vkhVG": "",
  "https://aka.doubaocdn.com/s/qM301vkct0": "",
  "https://aka.doubaocdn.com/s/qNir1vkgzj": "",
  "https://aka.doubaocdn.com/s/rNwq1vkhSL": "",
  "https://aka.doubaocdn.com/s/w7m81vkcsz": "",
  "https://aka.doubaocdn.com/s/xQNJ1vkhSK": "",
  "https://aka.doubaocdn.com/s/xeUl1vkgzi": "",
  "https://aka.doubaocdn.com/s/yhVU1vkhSJ": ""
};

// 需要替换的文件列表
const filesToReplace = [
  'dist/static/product-library/final_gallery.html',
  'dist/static/talent/design_team.html',
  'dist/static/talent/construction_team.html',
  'dist/static/talent/engineer_team.html',
  'dist/static/talent/education_experts.html',
  'dist/static/talent/integrated_apple_style.html',
  'aka-url-reports/replace-urls.js',
  'public/static/product-library/final_gallery.html',
  'public/static/talent/design_team.html',
  'public/static/talent/construction_team.html',
  'public/static/talent/engineer_team.html',
  'public/static/talent/education_experts.html',
  'public/static/talent/integrated_apple_style.html',
  'src/pages/ProductGallery.jsx'
];

console.log('开始替换 AKA URLs...');

let totalReplaced = 0;

filesToReplace.forEach(function(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log('文件不存在: ' + filePath);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let fileReplaced = 0;

  Object.entries(replacementMap).forEach(function(entry) {
    const oldUrl = entry[0];
    const newUrl = entry[1];

    if (!newUrl) {
      return;
    }

    const escapedUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&');
    const regex = new RegExp(escapedUrl, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newUrl);
      fileReplaced += matches.length;
      totalReplaced += matches.length;
    }
  });

  if (fileReplaced > 0) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(filePath + ': 替换了 ' + fileReplaced + ' 个 URL');
  }
});

console.log('\n完成! 总共替换了 ' + totalReplaced + ' 个 URL');
