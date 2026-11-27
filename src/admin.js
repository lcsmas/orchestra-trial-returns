'use strict';
const { carrierReturned } = require('./returns');

// Manual return: goes through the carrier-return path (T1) so effects are identical (contract manual-same-effects).
function markReturned(parcelId) {
  return carrierReturned(parcelId);
}

module.exports = { markReturned };
