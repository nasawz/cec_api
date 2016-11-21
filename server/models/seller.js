'use strict';

module.exports = function(Seller) {
  /**
   * 认证经销店
   * @param {string} code 经销店编码
   * @param {Function(Error, object)} callback
   */
  Seller.auth = function(code, callback) {
    var result = {
      result: 'succ'
    };
    // TODO
    callback(null, result);
  };
};
