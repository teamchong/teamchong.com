const fs = require('fs');
const path = require('path');

(async function() {
  const path1 = __dirname;
  const result = {};
  walkdir(result, path1);
  fs.writeFileSync(path.join(__dirname, 'data.js'), "var data="+JSON.stringify(result));
})();
function walkdir(result, path1) {
  const opt = { withFileTypes: true };
  for (const item1 of fs.readdirSync(path1, opt)) {
    if (!item1.isFile()) {
      result[item1.name] = {};
      walkdir(result[item1.name], path.join(path1, item1.name));
    } else if(/\.jpg$/.test(item1.name)) {
      result[item1.name] = 1;
    }
  }
}