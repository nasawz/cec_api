'use strict';

module.exports = function(app) {
  // var User = app.models.user;
  // var Role = app.models.Role;
  // var RoleMapping = app.models.RoleMapping;
  // User.create([
  //   {
  //     username: 'John',
  //     email: 'john@doe.com',
  //     password: 'opensesame'
  //   }, {
  //     username: 'Jane',
  //     email: 'jane@doe.com',
  //     password: 'opensesame'
  //   }, {
  //     username: 'Bob',
  //     email: 'bob@projects.com',
  //     password: 'opensesame'
  //   }
  // ], function(err, users) {
  //   if (err)
  //     return console.log('%j', err);
  //
  //   //...
  //   // Create projects, assign project owners and project team members
  //   //...
  //   // Create the admin role
  //   Role.create({
  //     name: 'admin'
  //   }, function(err, role) {
  //     if (err)
  //       return console.log(err);
  //     console.log(role);
  //
  //     // Make Bob an admin
  //     role.principals.create({
  //       principalType: RoleMapping.USER,
  //       principalId: users[2].id
  //     }, function(err, principal) {
  //       if (err)
  //         return console.log(err);
  //       console.log(principal);
  //     });
  //   });
  // });
};
