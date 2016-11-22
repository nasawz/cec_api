'use strict';

var request = require('superagent')

module.exports = function(User) {
  User.disableRemoteMethod('create', true);
  User.disableRemoteMethod('upsert', true);
  User.disableRemoteMethod('updateAll', true);
  User.disableRemoteMethod('updateAttributes', false);

  User.disableRemoteMethod('find', true);
  User.disableRemoteMethod('findById', true);
  User.disableRemoteMethod('findOne', true);

  User.disableRemoteMethod('deleteById', true);

  User.disableRemoteMethod('confirm', true);
  User.disableRemoteMethod('count', true);
  User.disableRemoteMethod('exists', true);
  User.disableRemoteMethod('resetPassword', true);

  User.disableRemoteMethod('__count__accessTokens', false);
  User.disableRemoteMethod('__create__accessTokens', false);
  User.disableRemoteMethod('__delete__accessTokens', false);
  User.disableRemoteMethod('__destroyById__accessTokens', false);
  User.disableRemoteMethod('__findById__accessTokens', false);
  User.disableRemoteMethod('__get__accessTokens', false);
  User.disableRemoteMethod('__updateById__accessTokens', false);

  User.disableRemoteMethod('createChangeStream', true);
  User.disableRemoteMethod('upsertWithWhere', true);
  User.disableRemoteMethod('replaceOrCreate', true);
  User.disableRemoteMethod('replaceById', true);

  User.disableRemoteMethod('login', true);


  /**
   * 登录认证
   * @param {string} access_token
   * @param {string} openid
   * @param {Function(Error, object)} callback
   */
  User.auth = function(access_token, openid, callback) {
    console.log(access_token, openid);
    var req = request.get("http://auth.vkeve.com/userinfo?access_token=" + access_token + "&openid=" + openid)
    req.timeout(10000)
    req.end((err, res) => {
      if (err) {
        callback(err, null);
      }
      var user = res.body
      user.email = res.body.openid + '@toyota.io'
      user.password = res.body.openid
      User.findOrCreate(user, (err, u) => {
        var TWO_WEEKS = 60 * 60 * 24 * 7 * 2;
        User.login({
          email: u.email, // must provide email or "username"
          password: u.openid, // required by default
          ttl: TWO_WEEKS // keep the AccessToken alive for at least two weeks
        }, 'user', function(err, accessToken) {
          if (err) {
            callback(err, null);
          }
          //   console.log(err);
          //   console.log(accessToken);
          //   console.log(accessToken.id); // => GOkZRwg... the access token
          //   console.log(accessToken.ttl); // => 1209600 time to live
          //   console.log(accessToken.created); // => 2013-12-20T21:10:20.377Z
          //   console.log(accessToken.userId); // => 1
          callback(null, accessToken);
        });
      })
    })
  };

};
