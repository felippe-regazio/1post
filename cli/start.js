const fs = require('fs');
const path = require('path');
const templateDir = path.resolve(__dirname, '../template');

fs.readdirSync(templateDir).forEach(fileName => {
  const from = path.resolve(templateDir, fileName);
  const to = path.resolve(process.cwd(), fileName);

  fs.copyFileSync(from, to);
});

console.log("Done. Happy blogging!");