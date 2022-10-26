'use strict';
const assert = require('assert');

module.exports = app => {
  const index = app.config.appMiddleware.indexOf('monitor');
  assert.equal(
    index,
    -1,
    'Duplication of middleware name found: monitor. Rename your middleware other than "monitor" please.'
  );
  app.config.coreMiddleware.unshift('monitor');
};
