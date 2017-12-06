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
  //   name: 'demo',
  //   ename: 'demo',
  // }, function(err, tenant) {
  //   console.log(err, tenant);

  //   /**
  //    * 创建admin
  //    */
  //   User.create([
  //     {
  //       username: 'nasa',
  //       email: 'nasa.wang@nicesn.com',
  //       password: '111111',
  //       status: '999',
  //       tenant: tenant,
  //     },
  //   ], function(err, users) {
  //     if (err) {
  //       return console.log('%j', err);
  //     }

  //     Role.findOrCreate({
  //       name: 'admin',
  //     }, function(err, role) {
  //       if (err) {
  //         return console.log(err);
  //       }
  //       // Make nasa an admin
  //       role.principals.create({
  //         principalType: RoleMapping.USER,
  //         principalId: users[0].id,
  //       }, function(err, principal) {
  //         if (err) {
  //           return console.log(err);
  //         }

  //         console.log(principal);
  //       });
  //     });

  //     /**
  //      * 经销商数据
  //      */
  //     var Seller = app.models.seller;
  //     Seller.create([
  //       {
  //         name: '经销店A',
  //         code: '001',
  //         tenant: tenant,
  //       }, {
  //         name: '经销店B',
  //         code: '002',
  //         tenant: tenant,
  //       }, {
  //         name: '经销店C',
  //         code: '003',
  //         tenant: tenant,
  //       }, {
  //         name: '经销店D',
  //         code: '004',
  //         tenant: tenant,
  //       }, {
  //         name: '经销店E',
  //         code: '005',
  //         tenant: tenant,
  //       },
  //     ], function(err, sellers) {
  //       console.log(sellers);
  //     });

  //     /**
  //      * 创建活动
  //      */
  //     var Activity = app.models.activity;

  //     Activity.create({
  //       title: '圣诞倒计时！《妆点圣诞，温暖一冬》活动暖心来袭！',
  //       desc: '快来装饰圣诞树赢取大奖吧！',
  //       share: {
  //         title: '圣诞倒计时！《妆点圣诞，温暖一冬》活动暖心来袭！',
  //         desc: '快来装饰圣诞树赢取大奖吧！',
  //         url: '',
  //         img: 'http://ces00.b0.upaiyun.com/2016/12/07/upload_8310b8fd0ebf2d96d026449cd91b2ec6.jpg',
  //       },
  //       type: 'collect',
  //       tenant: tenant,
  //     }, function(err, activity) {
  //       console.log(activity);

  //       /**
  //          * 增加礼品
  //          */
  //       var Lottery = app.models.lottery;
  //       Lottery.create({
  //         activity: activity,
  //         tenant: tenant,
  //         prizes: [
  //           {
  //             name: '2999Gopro一台',
  //             total: 5,
  //             cost: 0,
  //             level: 1,
  //           }, {
  //             name: '1000元携程卡',
  //             total: 10,
  //             cost: 0,
  //             level: 2,
  //           }, {
  //             name: '300元京东卡',
  //             total: 100,
  //             cost: 0,
  //             level: 3,
  //           },
  //         ],
  //       }, function(err, lottery) {
  //         console.log(lottery);
  //       });
  //     });
  //   });
  // });
};
