'use strict';
const { store, events } = require('./index');

// The one path into the returned state, for every trigger (carrier or manual). Idempotent.
// Emits 'returned' ({ parcelId, parcel }) AFTER state is set, once per parcel (open point 1, T2) so effects react to the state, not the trigger.
function returned(parcelId) {
  const parcel = store.parcels.get(parcelId);
  if (!parcel) throw new Error(`unknown parcel: ${parcelId}`);
  if (parcel.state === 'returned') return parcel;
  parcel.state = 'returned';
  events.emit('returned', { parcelId, parcel });
  return parcel;
}

function carrierReturned(parcelId) { return returned(parcelId); }

module.exports = { carrierReturned, returned };
