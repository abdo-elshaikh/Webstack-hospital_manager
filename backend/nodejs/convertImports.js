const fs = require('fs');
const path = require('path');

const convertFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import statements
  content = content.replace(/import\s+(\w+)\s+from\s+['"](.+)['"];/g, 'const $1 = require(\'$2\');');

  // Replace export statements
  content = content.replace(/export\s+default\s+(\w+);/g, 'module.exports = $1;');

  fs.writeFileSync(filePath, content, 'utf8');
};

const traverseDirectory = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      traverseDirectory(filePath);
    } else if (filePath.endsWith('.js')) {
      convertFile(filePath);
    }
  });
};

traverseDirectory(path.resolve(__dirname, '.'));
