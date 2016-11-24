'use strict';
var LoopBackContext = require('loopback-context');
var _ = require('lodash');
var updateUserChannel = require('./helper/').updateUserChannel
var updateUserContacts = require('./helper/').updateUserContacts
// var app = require('../../server/server');
module.exports = function(Collect) {
  Collect.disableRemoteMethod('create', true); // Removes (POST) /module

  Collect.disableRemoteMethod('find', true);
  // Collect.disableRemoteMethod('findById', true);
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
  Collect.support = function(cid, data, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }
    Collect.findOne({
      id: cid
    }, function(err, collent) {
      if (err || collent == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (collent.ownerId.toString() == currentUser.id.toString()) {
        return callback(new Error('邀请好友来帮忙吧'), null);
      }
      data.user = {
        openid: currentUser.openid,
        nickname: currentUser.nickname,
        headimgurl: currentUser.headimgurl,
        id: currentUser.id
      }
      data.openid = currentUser.openid
      data.created = new Date()
      var supports = collent.supports
        ? collent.supports
        : []
      if (supports.length >= 5) {
        return callback(new Error('好友已经达成条件了'), null);
      }
      var _supports = _.keyBy(supports, 'openid')
      if (_.has(_supports, data.openid)) {
        return callback(new Error('你已经帮助过了'), null);
      }
      supports.push(data)
      collent.updateAttributes({
        supports: supports
      }, function(err, _collent) {
        if (err) {
          return callback(err, null);
        }
        return callback(null, _collent, 'application/json');
      })
    })
  };

  /**
   * 允许
   * @param {string} cid collect id
   * @param {string} code 经销店编码
   * @param {Function(Error, object)} callback
   */
  Collect.permit = function(cid, code, callback) {
    var Seller = Collect.app.models.seller;
    Collect.findOne({
      id: cid
    }, function(err, collent) {
      if (err || collent == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (collent.supports.length < 5) {
        return callback(new Error('客户参与条件未达成'), null);
      }
      if (collent.status == '1') {
        return callback(new Error('客户已点亮圣诞树'), null);
      }
      if (collent.status == '2') {
        return callback(new Error('客户已点亮圣诞树'), null); //已经留资
      }
      if (collent.status == '3') {
        return callback(new Error('客户已抽奖'), null);
      }
      Seller.findOne({
        code: code
      }, function(err, seller) {
        if (err || seller == null) {
          var _err = err
            ? err
            : new Error('未找到经销商')
          return callback(_err, null);
        }
        seller.permitAt = new Date()
        collent.updateAttributes({
          seller: seller,
          status: '1',
          code: code
        }, function(err, _collent) {
          if (err) {
            return callback(err, null);
          }
          return callback(null, _collent, 'application/json');
        })
      })
    })
  };

  /**
   * 当前登录用户留资
   * @param {string} cid collect id
   * @param {object} data 联系人数据
   * @param {Function(Error, object)} callback
   */
  Collect.contacts = function(cid, data, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }

    Collect.findOne({
      id: cid
    }, function(err, collent) {
      if (err || collent == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (collent.supports.length < 5) {
        return callback(new Error('参与条件未达成'), null);
      }
      if (collent.ownerId.toString() != currentUser.id.toString()) {
        return callback(new Error('不是自己发起的活动'), null);
      }
      if (collent.status == '2') {
        return callback(new Error('用户已留资'), null);
      }
      if (collent.status != '1') {
        return callback(new Error('未点亮圣诞树'), null);
      }
      collent.updateAttributes({
        contacts: data,
        status: '2'
      }, function(err, _collent) {
        if (err) {
          return callback(err, null);
        }
        updateUserContacts(currentUser, data)
        return callback(null, _collent, 'application/json');
      })
    })
  };

  /**
   * 参与
   * @param {string} channel 渠道
   * @param {Function(Error, object)} callback
   */
  Collect.join = function(channel, activityId, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    var Activity = Collect.app.models.activity;
    Activity.findOne({
      id: activityId
    }, function(err, activity) {
      if (err || activity == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      Collect.findOrCreate({
        where: {
          ownerId: currentUser.id
        }
      }, {
        owner: currentUser,
        activity: activity,
        channel: channel
      }, function(err, collect) {
        if (err) {
          return callback(err, null);
        }
        updateUserChannel(currentUser, channel)
        callback(null, collect, 'application/json');
      })
    })
  };

};
