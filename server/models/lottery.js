'use strict';

module.exports = function(Lottery) {
  Lottery.disableRemoteMethod('create', true); // Removes (POST) /module

  Lottery.disableRemoteMethod('find', true);
  Lottery.disableRemoteMethod('findById', true);
  Lottery.disableRemoteMethod('findOne', true);
  Lottery.disableRemoteMethod('count', true);
  Lottery.disableRemoteMethod('exists', true);


  Lottery.disableRemoteMethod('upsert', true); // Removes (PUT) /module
  Lottery.disableRemoteMethod('updateAll', true); // Removes (POST) /module/update
  Lottery.disableRemoteMethod('updateAttributes', false); // Removes (PUT) /module/:id
  Lottery.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /module/change-stream
  Lottery.disableRemoteMethod('upsertWithWhere', true);
  Lottery.disableRemoteMethod('replaceOrCreate', true);
  Lottery.disableRemoteMethod('replaceById', true);

  Lottery.disableRemoteMethod('deleteById', true); // Removes (DELETE) /module/:id

  Lottery.disableRemoteMethod('__get__activity', false);
};
