'use strict';
// In-memory data: parcels and devices.
const parcels = new Map(); // id -> { id, state, deviceId }
const devices = new Map(); // id -> { id, location }
function reset() { parcels.clear(); devices.clear(); }
module.exports = { parcels, devices, reset };
