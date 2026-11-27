'use strict';
const { store, events } = require('./index');

// The one path into the returned state, for every trigger (carrier or manual). Idempotent.
// Emits 'returned' ({ parcelId, parcel }) once per parcel so effects react to the state, not the trigger.
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
