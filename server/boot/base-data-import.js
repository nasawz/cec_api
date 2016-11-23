'use strict';

module.exports = function(app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var Tenant = app.models.tenant;

  /**
   * 创建默认租户和管理员
   */
  // Tenant.create({
  //   name: 'ftms'
  // }, function(err, tenant) {
  //   console.log(err, tenant);
  //
  //   /**
  //    * 创建admin
  //    */
  //   User.create([
  //     {
  //       username: 'nasa',
  //       email: 'nasa127@gmail.com',
  //       password: '111111',
  //       status: '999',
  //       tenant: tenant
  //     }
  //   ], function(err, users) {
  //     if (err) {
  //       return console.log('%j', err);
  //     }
  //
  //     Role.findOrCreate({
  //       name: 'admin'
  //     }, function(err, role) {
  //       if (err) {
  //         return console.log(err);
  //       }
  //       // Make nasa an admin
  //       role.principals.create({
  //         principalType: RoleMapping.USER,
  //         principalId: users[0].id
  //       }, function(err, principal) {
  //         if (err) {
  //           return console.log(err);
  //         }
  //
  //         console.log(principal);
  //       });
  //     });
  //   });
  // })

  /**
   * 经销商数据
   */
  // var Seller = app.models.seller;
  // var tenantId = '583554ac08da54fe763c1499'
  // Tenant.findOne({
  //   id: tenantId
  // }, function(err, tenant) {
  //   Seller.create([
  //     {
  //       name: '经销店A',
  //       code: '001',
  //       tenant: tenant
  //     }, {
  //       name: '经销店B',
  //       code: '002',
  //       tenant: tenant
  //     }, {
  //       name: '经销店C',
  //       code: '003',
  //       tenant: tenant
  //     }, {
  //       name: '经销店D',
  //       code: '004',
  //       tenant: tenant
  //     }, {
  //       name: '经销店E',
  //       code: '005',
  //       tenant: tenant
  //     }
  //   ], function(err, sellers) {
  //     console.log(sellers);
  //   })
  // })

  /**
   * 创建活动
   */
  // var Activity = app.models.activity;
  // var tenantId = '583554ac08da54fe763c1499'
  // Tenant.findOne({
  //   id: tenantId
  // }, function(err, tenant) {
  //   Activity.create({
  //     title: '圣诞树',
  //     desc: '点亮圣诞树抽奖',
  //     share: {
  //       title: '圣诞树',
  //       desc: '点亮圣诞树抽奖',
  //       url: '',
  //       img: ''
  //     },
  //     type: 'collect',
  //     tenant: tenant
  //   }, function(err, activity) {
  //     console.log(activity);
  //   })
  // })

  /**
   * 增加礼品
   */
  // var Activity = app.models.activity;
  // var activityId = '583558bbdd516b9582543948'
  // var Lottery = app.models.lottery;
  // var tenantId = '583554ac08da54fe763c1499'
  // Tenant.findOne({
  //   id: tenantId
  // }, function(err, tenant) {
  //   Activity.findOne({
  //     id: activityId
  //   }, function(err, activity) {
  //     Lottery.create({
  //       activity: activity,
  //       tenant: tenant,
  //       prizes: [
  //         {
  //           name: '2999Gopro一台',
  //           total: 5,
  //           cost: 0,
  //           level: 1
  //         }, {
  //           name: '1000元携程卡',
  //           total: 10,
  //           cost: 0,
  //           level: 2
  //         }, {
  //           name: '300元京东卡',
  //           total: 100,
  //           cost: 0,
  //           level: 3
  //         }
  //       ]
  //     }, function(err, lottery) {
  //       console.log(lottery);
  //     })
  //   })
  // })
};
