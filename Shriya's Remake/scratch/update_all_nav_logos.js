const fs = require('fs');
const path = require('path');

const rootDir = "d:/riya/Shriya's Portfolio/Shriya's Remake";
const svgPath = path.join(rootDir, "images/shriya/shriya-butterfly-logo.svg");
const newSvg = fs.readFileSync(svgPath, 'utf8').trim();

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git' && item !== 'scratch') {
        results = results.concat(getHtmlFiles(full));
      }
    } else if (item.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to update.`);

const svgRegex = /<svg class=["']brand-logo-icon["'][\s\S]*?<\/svg>/;

let updatedCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (svgRegex.test(content)) {
    content = content.replace(svgRegex, newSvg);
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${path.relative(rootDir, file)}`);
  } else {
    console.log(`No matching brand-logo-icon SVG found in: ${path.relative(rootDir, file)}`);
  }
}

console.log(`Successfully updated logo in ${updatedCount} files.`);
