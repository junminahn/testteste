const fs = require('fs');
const path = require('path');
const reverseMustache = require('reverse-mustache');

const template = fs.readFileSync('sample.md', 'utf8');
const content = fs.readFileSync('render.md', 'utf8');

const data = reverseMustache({
  template,
  content,
});

console.log(data);
