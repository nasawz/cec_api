'use strict';

module.exports = function(Tenant) {
  Tenant.disableRemoteMethod('create', true); // Removes (POST) /module

  Tenant.disableRemoteMethod('find', true);
  Tenant.disableRemoteMethod('findById', true);
  Tenant.disableRemoteMethod('findOne', true);
  Tenant.disableRemoteMethod('count', true);
  Tenant.disableRemoteMethod('exists', true);

  Tenant.disableRemoteMethod('upsert', true); // Removes (PUT) /module
  Tenant.disableRemoteMethod('updateAll', true); // Removes (POST) /module/update
  Tenant.disableRemoteMethod('updateAttributes', false); // Removes (PUT) /module/:id
  Tenant.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /module/change-stream
  Tenant.disableRemoteMethod('upsertWithWhere', true);
  Tenant.disableRemoteMethod('replaceOrCreate', true);
  Tenant.disableRemoteMethod('replaceById', true);

  Tenant.disableRemoteMethod('deleteById', true); // Removes (DELETE) /module/:id
};
