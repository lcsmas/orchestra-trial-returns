'use strict';
// T2: a parcel reaching `returned` moves its device to `rma`, once per parcel.
const events = require('./events');
const store = require('./store');

// Effect of the `returned` signal (T1). Payload: parcel id, or an object carrying it.
function rma(payload) {
  const id = payload !== null && typeof payload === 'object' ? (payload.parcelId ?? payload.id) : payload;
  const parcel = store.parcels.get(id);
  if (!parcel || parcel.rmaMoved) return;
  const device = parcel.deviceId == null ? undefined : store.devices.get(parcel.deviceId);
  if (!device) return;
  device.location = 'rma';
  parcel.rmaMoved = true;
}

let registered = false;
function register() { if (!registered) { events.on('returned', rma); registered = true; } }
register();

module.exports = { rma, register };
