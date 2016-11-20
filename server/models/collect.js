'use strict';
// var app = require('../../server/server');
module.exports = function(Collect) {
  /**
 *
 * @param {string} msg
 * @param {Function(Error, string, string)} callback
 */

  Collect.greet = function(msg, callback) {
    var app = Collect.app;

    console.log(app.models)
    var result = msg;
    var hi = 'hi';
    // TODO
    callback(null, result, hi);
  };
};
