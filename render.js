const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

const template = fs.readFileSync('sample.md', 'utf8');

console.log(template);

const view = {
  name: 'test-client',
  devcreate: true,
};

const output = Mustache.render(template, view);

fs.writeFileSync('render.md', output);
