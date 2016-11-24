'use strict';
var _ = require('lodash');

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

module.exports.updateUserChannel = updateUserChannel
module.exports.updateUserContacts = updateUserContacts
