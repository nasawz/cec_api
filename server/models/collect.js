'use strict';
// var app = require('../../server/server');
module.exports = function(Collect) {
  /**
   * 当前登录的所有者抽奖
   * @param {string} cid collect id
   * @param {Function(Error, object)} callback
   */
  Collect.lottery = function(cid, callback) {
    var result = {
      result: 'succ'
    };
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
