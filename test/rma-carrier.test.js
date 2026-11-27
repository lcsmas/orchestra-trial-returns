'use strict';
const test = require('node:test'); const assert = require('node:assert');
const { store } = require('../src'); // loading ../src registers the rma effect on the real bus
const { carrierReturned, returned } = require('../src/returns');

function seed(deviceId = 'd1') {
  store.reset();
  if (deviceId) store.devices.set(deviceId, { id: deviceId, location: 'stock' });
  store.parcels.set('p1', { id: 'p1', state: 'shipped', deviceId: deviceId || undefined });
}

test('carrier return moves the device to rma', () => {
  seed(); carrierReturned('p1');
  assert.strictEqual(store.devices.get('d1').location, 'rma');
});

test('carrier return of a parcel without device does not throw', () => {
  seed(null); assert.doesNotThrow(() => carrierReturned('p1'));
  assert.strictEqual(store.parcels.get('p1').state, 'returned');
});

test('returned set twice moves once', () => {
  seed(); returned('p1'); store.devices.get('d1').location = 'bench'; returned('p1'); carrierReturned('p1');
  assert.strictEqual(store.devices.get('d1').location, 'bench');
});
