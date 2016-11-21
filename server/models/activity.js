'use strict';

module.exports = function(Activity) {
  Activity.disableRemoteMethod('create', true); // Removes (POST) /module

  Activity.disableRemoteMethod('find', true);
  Activity.disableRemoteMethod('findById', true);
  Activity.disableRemoteMethod('findOne', true);
  Activity.disableRemoteMethod('count', true);
  Activity.disableRemoteMethod('exists', true);


  Activity.disableRemoteMethod('upsert', true); // Removes (PUT) /module
  Activity.disableRemoteMethod('updateAll', true); // Removes (POST) /module/update
  Activity.disableRemoteMethod('updateAttributes', false); // Removes (PUT) /module/:id
  Activity.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /module/change-stream
  Activity.disableRemoteMethod('upsertWithWhere', true);
  Activity.disableRemoteMethod('replaceOrCreate', true);
  Activity.disableRemoteMethod('replaceById', true);

  Activity.disableRemoteMethod('deleteById', true); // Removes (DELETE) /module/:id


};
