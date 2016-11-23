'use strict';

module.exports = function(Tenant) {
  Seller.disableRemoteMethod('create', true); // Removes (POST) /module

  Seller.disableRemoteMethod('find', true);
  Seller.disableRemoteMethod('findById', true);
  Seller.disableRemoteMethod('findOne', true);
  Seller.disableRemoteMethod('count', true);
  Seller.disableRemoteMethod('exists', true);

  Seller.disableRemoteMethod('upsert', true); // Removes (PUT) /module
  Seller.disableRemoteMethod('updateAll', true); // Removes (POST) /module/update
  Seller.disableRemoteMethod('updateAttributes', false); // Removes (PUT) /module/:id
  Seller.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /module/change-stream
  Seller.disableRemoteMethod('upsertWithWhere', true);
  Seller.disableRemoteMethod('replaceOrCreate', true);
  Seller.disableRemoteMethod('replaceById', true);

  Seller.disableRemoteMethod('deleteById', true); // Removes (DELETE) /module/:id
};
