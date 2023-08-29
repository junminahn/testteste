const yaml = require('js-yaml');
const fs = require('fs');

let content = fs.readFileSync('sample.yaml', 'utf8');
const patt = new RegExp('```yml((.|\n)*?)```', 'g');

m = patt.exec(content);

if (m) {
  content = m[1];
}

try {
  const doc = yaml.load(content);
  console.log(JSON.stringify(doc));
} catch (e) {
  console.log(e.reason);
}

