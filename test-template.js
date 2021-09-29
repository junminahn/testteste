const fs = require('fs');
const _ = require('lodash');
const Mustache = require('mustache');

const content = fs.readFileSync('client.tf.template', { encoding: 'utf8' });
const compiled = _.template(content);
// const result = compiled({
//   redirectUrls: ['https://example.com', 'https://example22.com'],
// });

var view = {
  client: 'Joe',
  redirectUrls: ['https://example.com', 'https://example22.com'],
};

const result = Mustache.render(content, view);

fs.writeFileSync('client.tf', result);
