'use strict';

module.exports = function(Lotteryhistory) {
  Lotteryhistory.disableRemoteMethod('create', true); // Removes (POST) /module



  Lotteryhistory.disableRemoteMethod('upsert', true); // Removes (PUT) /module
  Lotteryhistory.disableRemoteMethod('updateAll', true); // Removes (POST) /module/update
  Lotteryhistory.disableRemoteMethod('updateAttributes', false); // Removes (PUT) /module/:id
  Lotteryhistory.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /module/change-stream
  Lotteryhistory.disableRemoteMethod('upsertWithWhere', true);
  Lotteryhistory.disableRemoteMethod('replaceOrCreate', true);
  Lotteryhistory.disableRemoteMethod('replaceById', true);

  Lotteryhistory.disableRemoteMethod('deleteById', true); // Removes (DELETE) /module/:id
};
