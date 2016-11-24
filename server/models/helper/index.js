'use strict';
var _ = require('lodash');

/**
* updateUserChannel - 更新用户渠道
*
* @param  {type} channel description
* @return {type}         description
*/
function updateUserChannel(currentUser, channel) {
  var channels = currentUser.channels
    ? currentUser.channels
    : []
  channels = _.union(channels, [channel]);
  currentUser.updateAttributes({channels: channels})
}

module.exports.updateUserChannel = updateUserChannel
