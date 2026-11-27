'use strict';
const { devices } = require('./store');

// Ids of the devices whose location is `rma` (T2 interface v1), sorted by id.
// Reads device state only: whatever put a device in `rma` (carrier or manual) is T2's path.
function rmaList() {
  return [...devices.values()]
    .filter((d) => d.location === 'rma')
    .map((d) => d.id)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

module.exports = { rmaList };
