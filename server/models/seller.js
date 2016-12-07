'use strict';

var LoopBackContext = require('loopback-context');
var _ = require('lodash');
var updateUserSeller = require('./helper/').updateUserSeller

module.exports = function(Seller) {
  Seller.disableRemoteMethod('create', true); // Removes (POST) /module

  Seller.disableRemoteMethod('find', true);
  Seller.disableRemoteMethod('findById', true);
  Seller.disableRemoteMethod('findOne', true);
  Seller.disableRemoteMethod('count', true);
  Seller.disableRemoteMethod('exists', true);

  Seller.disableRemoteMethod('upsert', true); // Removes (PUT) /module
  Seller.disableRemoteMethod('updateAll', true); // Removes (POST) /module/update
  Seller.disableRemoteMethod('updateAttributes', false); // Removes (PUT) /module/:id
  Seller.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /module/change-stream
  Seller.disableRemoteMethod('upsertWithWhere', true);
  Seller.disableRemoteMethod('replaceOrCreate', true);
  Seller.disableRemoteMethod('replaceById', true);

  Seller.disableRemoteMethod('deleteById', true); // Removes (DELETE) /module/:id

  Seller.disableRemoteMethod('__get__tenant', false);

  /**
   * 认证经销店
   * @param {string} code 经销店编码
   * @param {Function(Error, object)} callback
   */
  Seller.certification = function(code, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }
    code = _.toUpper(code).replace(/\s/g, '')
    Seller.findOne({
      where: {
        code: code
      }
    }, function(err, seller) {
      if (err || seller == null) {
        var _err = err
          ? err
          : new Error('未找到经销商')
        return callback(_err, null);
      }
      updateUserSeller(currentUser,code)
      callback(null, seller, 'application/json');
    })
  };
};
