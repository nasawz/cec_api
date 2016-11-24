'use strict';
var _ = require('lodash');
var app = require('../../server.js');

/**
* updateUserChannel - 更新用户渠道
*
* @param  {type} channel description
* @return {type}         description
*/
function updateUserChannel(user, channel) {
  var channels = user.channels
    ? user.channels
    : []
  channels = _.union(channels, [channel]);
  user.updateAttributes({channels: channels})
}

/**
 * updateUserContacts - 更新用户的联系信息
 *
 * @param  {type} user     description
 * @param  {type} contacts description
 * @return {type}          description
 */
function updateUserContacts(user, contacts) {
  var _contacts = user.contacts
  _contacts = _.merge({}, _contacts, contacts)
  user.updateAttributes({contacts: _contacts})
}

/**
 * userLottery - 抽奖
 *
 * @param  {type} user description
 * @param  {type} aid  description
 * @param  {type} cb   description
 * @return {type}      description
 */
function userLottery(user, aid, cb) {
  var Lottery = app.models.lottery
  Lottery.findOne({
    activityId: aid
  }, function(err, lottery) {
    if (err) {
      cb(err, null)
    }
    var dice = _.random(1, true)
    var prizes = _.orderBy(lottery.prizes, ['level'], ['asc']);
    for (var i = 0; i < prizes.length; i++) {
      var diff = dice - prizes[i].level
      if (diff < 0 && (prizes[i].total - prizes[i].cost) > 0) {
        return cb(null, prizes[i])
        break;
      }
    }
    return cb(null, null)
  })
}

/**
 * costPrize - 领取奖品池中的奖品
 *
 * @param  {type} user  description
 * @param  {type} aid   description
 * @param  {type} prize description
 * @param  {type} cb    description
 * @return {type}       description
 */
function costPrize(user, aid, prize, cb) {
  var Lottery = app.models.lottery
  Lottery.findOne({
    activityId: aid
  }, function(err, lottery) {
    if (err) {
      return cb(err, null)
    }
    if (prize) {
      var prizes = _.orderBy(lottery.prizes, ['level'], ['asc']);
      for (var i = 0; i < prizes.length; i++) {
        if (prizes[i].name == prize.name) {
          prizes[i].cost++
        }
      }
      lottery.updateAttributes({
        prizes: prizes
      }, function(err, _lottery) {
        if (err) {
          return cb(err, null)
        }
        return cb(null, true)
      })
    } else {
      return cb(null, true)
    }
  })
}

/**
 * recordLotteryHistory - 记录抽奖历史
 *
 * @param  {type} aid   description
 * @param  {type} user  description
 * @param  {type} prize description
 * @return {type}       description
 */
function recordLotteryHistory(aid, user, prize) {
  var Activity = app.models.activity
  var Lotteryhistory = app.models.lottery_history
  Activity.findOne({
    id: aid
  }, function(err, activity) {
    Lotteryhistory.create({activity: activity, user: user, prize: prize})
  })
}
module.exports.updateUserChannel = updateUserChannel
module.exports.updateUserContacts = updateUserContacts
module.exports.userLottery = userLottery
module.exports.costPrize = costPrize
module.exports.recordLotteryHistory = recordLotteryHistory
