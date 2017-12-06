'use strict';

var request = require('superagent')

module.exports = function (User) {
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

  User.disableRemoteMethod('__get__tenant', false);

  User.disableRemoteMethod('login', true);

  /**
   * 根据 access token 获取用户资料
   * @param {string} access_token
   * @param {Function(Error, object)} callback
   */
  User.info = function (access_token, callback) {

    // Report.findById({
    //   id: 1,
    //   filter: {
    //     include: 'lineitems'
    //   }
    // });

    //   var app = app.models.Book;
    var AccessToken = User.app.models.AccessToken;
    // console.log(AccessToken);
    AccessToken.findOne({
      where: {
        id: access_token
      }
    }, (err, at) => {
      if (err || !at) {
        return callback(new Error('登录超时，请重新登录'), null);
      }
      User.findOne({
        where: {
          id: at.userId
        }
      }, (err, u) => {
        if (err) {
          return callback(err, null);
        }
        return callback(null, u, 'application/json');
      })
    })
  };

  /**
   * 登录认证
   * @param {string} access_token
   * @param {string} openid
   * @param {Function(Error, object)} callback
   */
  User.auth = function (access_token, openid, tenantId, callback) {
    var Tenant = User.app.models.tenant;
    Tenant.findOne({
      id: tenantId
    }, function (err, tenant) {
      if (err) {
        return callback(err, null);
      }
      User.findOne({
        where: {
          openid: openid
        }
      }, (err, u) => {
        if (u) {
          var TWO_WEEKS = 60 * 60 * 24 * 7 * 20;
          User.login({
            email: u.email,
            password: u.openid,
            ttl: TWO_WEEKS
          }, 'user', function (err, accessToken) {
            if (err) {
              return callback(err, null);
            }
            return callback(null, accessToken, 'application/json');
          });
        } else {
          var req = request.get("http://cod.baleina.cn/userinfo?access_token=" + access_token + "&openid=" + openid)
          req.timeout(100000)
          req.end((err, res) => {
            if (err) {
              return callback(err, null);
            }
            var user = res.body
            user.email = res.body.openid + '@' + tenant.ename + '.io'
            user.password = res.body.openid
            user.tenant = tenant
            User.findOrCreate({
              where: {
                openid: openid
              }
            }, user, (err, u) => {
              var TWO_WEEKS = 60 * 60 * 24 * 7 * 20;
              User.login({
                email: u.email,
                password: u.openid,
                ttl: TWO_WEEKS
              }, 'user', function (err, accessToken) {
                if (err) {
                  return callback(err, null);
                }
                //   console.log(err);
                //   console.log(accessToken);
                //   console.log(accessToken.id); // => GOkZRwg... the access token
                //   console.log(accessToken.ttl); // => 1209600 time to live
                //   console.log(accessToken.created); // => 2013-12-20T21:10:20.377Z
                //   console.log(accessToken.userId); // => 1
                return callback(null, accessToken, 'application/json');
                //   cb(null, stream, 'application/octet-stream');
              });
            })
          })

        }
      })

    })
  };

};
