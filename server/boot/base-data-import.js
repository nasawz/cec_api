'use strict';

module.exports = function(app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  /**
   * 创建admin
   */
  User.create([
    {
      username: 'nasa',
      email: 'nasa127@gmail.com',
      password: '111111',
      status: '999',
    }
  ], function(err, users) {
    if (err) {
      return console.log('%j', err);
    }

    Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) {
        return console.log(err);
      }
      // Make nasa an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id,
      }, function(err, principal) {
        if (err) {
          return console.log(err);
        }

        console.log(principal);
      });
    });
  });
};
