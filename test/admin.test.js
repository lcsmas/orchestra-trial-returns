'use strict';
const test = require('node:test'); const assert = require('node:assert');
const { store } = require('../src');
const { markReturned } = require('../src/admin');
const { carrierReturned } = require('../src/returns');
require('../src/rma'); // registers the RMA effect (T2)

function seed(id = 'p1') {
  store.reset();
  store.devices.set('d1', { id: 'd1', location: 'customer' });
  store.parcels.set(id, { id, state: 'shipped', deviceId: 'd1' });
}

test('markReturned sets the parcel state to returned', () => {
  seed(); markReturned('p1');
  assert.strictEqual(store.parcels.get('p1').state, 'returned');
});

test('markReturned moves the device to rma, same as a carrier return', () => {
  seed(); markReturned('p1');
  const manual = store.devices.get('d1').location;
  seed(); carrierReturned('p1');
  assert.strictEqual(manual, 'rma');
  assert.strictEqual(store.devices.get('d1').location, manual);
});

test('marking an already returned parcel changes nothing', () => {
  seed(); markReturned('p1');
  store.devices.get('d1').location = 'repaired'; // would be reset to rma by a second effect
  markReturned('p1');
  assert.strictEqual(store.parcels.get('p1').state, 'returned');
  assert.strictEqual(store.devices.get('d1').location, 'repaired');
});

test('markReturned after a carrier return changes nothing', () => {
  seed(); carrierReturned('p1');
  store.devices.get('d1').location = 'repaired';
  markReturned('p1');
  assert.strictEqual(store.devices.get('d1').location, 'repaired');
});

test('unknown parcel id throws', () => {
  store.reset();
  assert.throws(() => markReturned('nope'));
});
