'use strict';
var LoopBackContext = require('loopback-context');
var _ = require('lodash');
var updateUserChannel = require('./helper/').updateUserChannel
var updateUserContacts = require('./helper/').updateUserContacts
var userLottery = require('./helper/').userLottery
var costPrize = require('./helper/').costPrize
var recordLotteryHistory = require('./helper/').recordLotteryHistory
var EventProxy = require('eventproxy');
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
// var app = require('../../server/server');
module.exports = function (Collect) {
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
  Collect.lottery = function (cid, aid, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }
    Collect.findOne({
      where: {
        id: cid
      }
    }, function (err, collect) {
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
      userLottery(currentUser, aid, function (err, prize) {
        if (err) {
          return callback(err, null);
        }
        costPrize(currentUser, aid, prize, function (err, result) {
          if (err) {
            return callback(err, null);
          }
          if (result) {
            var _prize = prize
              ? {
                name: prize.name,
                code: prize.code,
                time: new Date()
              }
              : {
                name: '未中奖',
                code: 'end',
                time: new Date()
              }
            collect.updateAttributes({
              prize: _prize,
              status: '3'
            }, function (err, _collect) {
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
  Collect.support = function (cid, data, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }
    Collect.findOne({
      where: {
        id: cid
      }
    }, function (err, collect) {
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
      var _tps = _.keyBy(supports, 'tp')
      if (_.has(_tps, data.tp)) {
        return callback(new Error('这里礼品已经送过了'), null);
      }

      supports.push(data)
      collect.updateAttributes({
        supports: supports
      }, function (err, _collect) {
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
  Collect.permit = function (cid, code, callback) {
    var Seller = Collect.app.models.seller;
    Collect.findOne({
      where: {
        id: cid
      }
    }, function (err, collect) {
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
      }, function (err, seller) {
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
        }, function (err, _collect) {
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
  Collect.contacts = function (cid, data, callback) {
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (!currentUser) {
      return callback(new Error('用户未登陆'), null);
    }

    Collect.findOne({
      where: {
        id: cid
      }
    }, function (err, collect) {
      if (err || collect == null) {
        var _err = err
          ? err
          : new Error('未找到活动')
        return callback(_err, null);
      }
      if (!collect.supports || collect.supports.length < 5) {
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
      }, function (err, _collect) {
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
  Collect.join = function (channel, activityId, callback) {
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
    }, function (err, activity) {
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
        }, function (err, collect) {
          if (err) {
            return callback(err, null);
          }
          updateUserChannel(currentUser, channel)
          callback(null, collect, 'application/json');
        })
    })
  };

  /**
 * 状态
 * @param {Function(Error, object)} callback
 */
  Collect.status = function (date, callback) {
    var ep = EventProxy.create("users", "collects", function (users, collects) {
      let obj = {}
      obj.total = getStatusNum(collects, users, true)
      obj.details = aysDetail(collects, users)
      callback(null, obj);
    });

    function aysDetail(collects, users) {
      var c_d = {}
      var u_d = {}
      var arr = [
        [
          ' 00:00', ' 01:00'
        ],
        [
          ' 01:00', ' 02:00'
        ],
        [
          ' 02:00', ' 03:00'
        ],
        [
          ' 03:00', ' 04:00'
        ],
        [
          ' 04:00', ' 05:00'
        ],
        [
          ' 05:00', ' 06:00'
        ],
        [
          ' 06:00', ' 07:00'
        ],
        [
          ' 07:00', ' 08:00'
        ],
        [
          ' 08:00', ' 09:00'
        ],
        [
          ' 09:00', ' 10:00'
        ],
        [
          ' 10:00', ' 11:00'
        ],
        [
          ' 11:00', ' 12:00'
        ],
        [
          ' 12:00', ' 13:00'
        ],
        [
          ' 13:00', ' 14:00'
        ],
        [
          ' 14:00', ' 15:00'
        ],
        [
          ' 15:00', ' 16:00'
        ],
        [
          ' 16:00', ' 17:00'
        ],
        [
          ' 17:00', ' 18:00'
        ],
        [
          ' 18:00', ' 19:00'
        ],
        [
          ' 19:00', ' 20:00'
        ],
        [
          ' 20:00', ' 21:00'
        ],
        [
          ' 21:00', ' 22:00'
        ],
        [
          ' 22:00', ' 23:00'
        ],
        [' 23:00', ' 24:00']
      ];

      collects.map((item) => {
        for (var i = 0; i < 24; i++) {
          if (item.created > new Date(date + arr[i][0]) && item.created <= new Date(date + arr[i][1])) {
            if (c_d[i.toString()]) {
              c_d[i.toString()]++
            } else {
              c_d[i.toString()] = 1
            }
          }
        }
      })
      users.map((item) => {
        for (var i = 0; i < 24; i++) {
          if (item.created > new Date(date + arr[i][0]) && item.created <= new Date(date + arr[i][1])) {
            if (u_d[i.toString()]) {
              u_d[i.toString()]++
            } else {
              u_d[i.toString()] = 1
            }
          }
        }
      })
      return { c_d: c_d, u_d: u_d }
    }

    function getAllUser(date) {
      var User = Collect.app.models.user;
      User.find({
        where: {
          and: [
            {
              created: {
                gt: new Date(date + ' 00:00')
              }
            }, {
              created: {
                lt: new Date(date + ' 23:59')
              }
            }
          ]
        }
      }, (err, users) => {
        if (err) {
          return callback(err, null);
        }
        ep.emit("users", users);
      })
    }

    function getAllCollect(date) {
      Collect.find({
        where: {
          and: [
            {
              created: {
                gt: new Date(date + ' 00:00')
              }
            }, {
              created: {
                lt: new Date(date + ' 23:59')
              }
            }
          ]
        }
      }, (err, collects) => {
        if (err) {
          return callback(err, null);
        }
        ep.emit("collects", collects);
      })
    }

    function getStatusNum(collects, users, raus) {

      let createNum = collects.length
      let joinNum = users.length
      let completeNum = 0
      let comeNum = 0
      let awardNum = 0
      let awardUsers = []
      collects.map((item) => {
        if (item.supports && item.supports.length == 5) {
          completeNum++
        }
        if (_.indexOf([
          '1', '2', '3'
        ], item.status) > -1) {
          comeNum++
        }
        if (item.prize && item.prize.name != '未中奖') {
          let awardObj = _.merge(item.contacts, item.prize)
          //   console.log(item.contacts, item.prize, awardObj);
          if (awardObj.time) {
            awardObj.dd = awardObj.time.Format("yyyy-MM-dd")
          } else {
            awardObj.dd = new Date().Format("yyyy-MM-dd")
          }
          delete awardObj.time
          delete awardObj.code
          awardUsers.push(awardObj)
          awardNum++
        }
      })
      if (raus) {
        return {
          completeNum: completeNum,
          comeNum: comeNum,
          awardNum: awardNum,
          createNum: createNum,
          joinNum: joinNum,
          awardUsers: awardUsers
        }
      }
      return { completeNum: completeNum, comeNum: comeNum, awardNum: awardNum, createNum: createNum, joinNum: joinNum }

    }

    getAllCollect(date)
    getAllUser(date)

  };
  /**
 * 留资数据
 * @param {Function(Error, object)} callback
 */

  Collect.contactslist = function (callback) {
    var ep = EventProxy.create("collects", function (collects) {
      var contacts = collects.map((item) => {
        item.contacts.time = item.created.Format("yyyy-MM-dd")
        return item.contacts
      })
      callback(null, contacts);
    });
    function getAllCollect() {
      Collect.find({
        where: {
          contacts: {
            neq: null
          }
        }
      }, (err, collects) => {
        if (err) {
          return callback(err, null);
        }
        console.log(collects);
        ep.emit("collects", collects);
      })
    }
    getAllCollect()

  };
};
