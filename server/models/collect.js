'use strict';
var LoopBackContext = require('loopback-context');
var _ = require('lodash');
var updateUserChannel = require('./helper/').updateUserChannel
var updateUserContacts = require('./helper/').updateUserContacts
var userLottery = require('./helper/').userLottery
var costPrize = require('./helper/').costPrize
var recordLotteryHistory = require('./helper/').recordLotteryHistory
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
  Collect.lottery = function(cid, aid, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }
    Collect.findOne({
      where: {
        id: cid
      }
    }, function(err, collect) {
      if (err || collect == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (collect.supports.length < 5) {
        return callback(new Error('参与条件未达成'), null);
      }
      if (collect.ownerId.toString() != currentUser.id.toString()) {
        return callback(new Error('不是自己发起的活动'), null);
      }
      if (collect.status == '3') {
        return callback(new Error('您已抽奖'), null);
      }
      if (collect.status != '2') {
        return callback(new Error('用户未留资'), null);
      }
      userLottery(currentUser, aid, function(err, prize) {
        if (err) {
          return callback(err, null);
        }
        costPrize(currentUser, aid, prize, function(err, result) {
          if (err) {
            return callback(err, null);
          }
          if (result) {
            var _prize = prize
              ? {
                name: prize.name,
                code: prize.code
              }
              : {
                name: '未中奖',
                code: 'end'
              }
            collect.updateAttributes({
              prize: _prize,
              status: '3'
            }, function(err, _collect) {
              if (err) {
                return callback(err, null);
              }
              recordLotteryHistory(aid, currentUser, prize)
              return callback(null, _collect, 'application/json');
            })
          }
        })
      })
    })
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
      where: {
        id: cid
      }
    }, function(err, collect) {
      if (err || collect == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (collect.ownerId.toString() == currentUser.id.toString()) {
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
      var supports = collect.supports
        ? collect.supports
        : []
      if (supports.length >= 5) {
        return callback(new Error('好友已经达成条件了'), null);
      }
      var _supports = _.keyBy(supports, 'openid')
      if (_.has(_supports, data.openid)) {
        return callback(new Error('你已经帮助过了'), null);
      }
      supports.push(data)
      collect.updateAttributes({
        supports: supports
      }, function(err, _collect) {
        if (err) {
          return callback(err, null);
        }
        return callback(null, _collect, 'application/json');
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
      where: {
        id: cid
      }
    }, function(err, collect) {
      if (err || collect == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (!collect.supports || collect.supports.length < 5) {
        return callback(new Error('客户参与条件未达成'), null);
      }
      if (collect.status == '1') {
        return callback(new Error('客户已点亮圣诞树'), null);
      }
      if (collect.status == '2') {
        return callback(new Error('客户已点亮圣诞树'), null); //已经留资
      }
      if (collect.status == '3') {
        return callback(new Error('客户已抽奖'), null);
      }
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
        seller.permitAt = new Date()
        collect.updateAttributes({
          seller: seller,
          status: '1',
          code: code
        }, function(err, _collect) {
          if (err) {
            return callback(err, null);
          }
          return callback(null, _collect, 'application/json');
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
      where: {
        id: cid
      }
    }, function(err, collect) {
      if (err || collect == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (collect.supports.length < 5) {
        return callback(new Error('参与条件未达成'), null);
      }
      if (collect.ownerId.toString() != currentUser.id.toString()) {
        return callback(new Error('不是自己发起的活动'), null);
      }
      if (collect.status == '2') {
        return callback(new Error('用户已留资'), null);
      }
      if (collect.status != '1') {
        return callback(new Error('未点亮圣诞树'), null);
      }
      collect.updateAttributes({
        contacts: data,
        status: '2'
      }, function(err, _collect) {
        if (err) {
          return callback(err, null);
        }
        updateUserContacts(currentUser, data)
        return callback(null, _collect, 'application/json');
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
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }
    var Activity = Collect.app.models.activity;
    Activity.findOne({
      where: {
        id: activityId
      }
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
        openid: currentUser.openid,
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
