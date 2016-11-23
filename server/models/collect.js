'use strict';
var LoopBackContext = require('loopback-context');
// var app = require('../../server/server');
module.exports = function(Collect) {
  Collect.disableRemoteMethod('create', true); // Removes (POST) /module

  Collect.disableRemoteMethod('find', true);
  Collect.disableRemoteMethod('findById', true);
  Collect.disableRemoteMethod('findOne', true);
  Collect.disableRemoteMethod('count', true);
  Collect.disableRemoteMethod('exists', true);


  Collect.disableRemoteMethod('upsert', true); // Removes (PUT) /module
  Collect.disableRemoteMethod('updateAll', true); // Removes (POST) /module/update
  Collect.disableRemoteMethod('updateAttributes', false); // Removes (PUT) /module/:id
  Collect.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /module/change-stream
  Collect.disableRemoteMethod('upsertWithWhere', true);
  Collect.disableRemoteMethod('replaceOrCreate', true);
  Collect.disableRemoteMethod('replaceById', true);

  Collect.disableRemoteMethod('deleteById', true); // Removes (DELETE) /module/:id

  Collect.disableRemoteMethod('__get__activity', false);
  Collect.disableRemoteMethod('__get__owner', false);
  /**
   * 当前登录的所有者抽奖
   * @param {string} cid collect id
   * @param {Function(Error, object)} callback
   */
  Collect.lottery = function(cid, callback) {
    var result = {
      result: 'succ'
    };

    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    console.log('currentUser: ', currentUser); // voila!
    // TODO
    callback(null, result);
  };

  /**
   * 支持
   * @param {string} cid collect id
   * @param {Function(Error, object)} callback
   */
  Collect.support = function(cid, callback) {
    var result = {
      result: 'succ'
    };
    // TODO
    callback(null, result);
  };

  /**
   * 允许
   * @param {string} cid collect id
   * @param {string} code 经销店编码
   * @param {Function(Error, object)} callback
   */
  Collect.permit = function(cid, code, callback) {
    var result = {
      result: 'succ'
    };
    // TODO
    callback(null, result);
  };


  /**
   * 当前登录用户留资
   * @param {string} cid collect id
   * @param {object} data 联系人数据
   * @param {Function(Error, object)} callback
   */
  Collect.contacts = function(cid, data, callback) {
    var result = {
      result: 'succ'
    };
    // TODO
    callback(null, result);
  };

  /**
   * 参与
   * @param {string} channel 渠道
   * @param {Function(Error, object)} callback
   */
  Collect.join = function(channel, callback) {
    var result = {
      result: 'succ'
    };
    // TODO
    callback(null, result);
  };

};
