'use strict';

const authentication = require('./authentication');
const rets = require('./rets');

module.exports = function() {
  const app = this;

  app.configure(authentication);
  app.configure(rets);
}