'use strict';
const test = require('node:test'); const assert = require('node:assert');
const { store } = require('../src');
const { rmaList } = require('../src/rma-list');

test.beforeEach(() => store.reset());

test('lists every rma device and no other, sorted by id', () => {
  for (const [id, location] of [['d3', 'rma'], ['d1', 'rma'], ['d2', 'stock'], ['d10', 'rma'], ['d4', undefined]]) {
    store.devices.set(id, { id, location });
  }
  assert.deepStrictEqual(rmaList(), ['d1', 'd10', 'd3']);
});

test('empty when no device is in rma', () => {
  store.devices.set('d1', { id: 'd1', location: 'stock' });
  assert.deepStrictEqual(rmaList(), []);
});

// Whatever the trigger (carrier or manual), the device ends in `rma`; the list only reads that.
test('lists devices regardless of how they got to rma', () => {
  store.devices.set('a', { id: 'a', location: 'rma' }); // carrier-return outcome
  store.devices.set('b', { id: 'b', location: 'rma' }); // manual-mark outcome
  assert.deepStrictEqual(rmaList(), ['a', 'b']);
});

// Through the owners (T1 setter, T2 effect): a carrier return and a manual path both land in the list.
test('lists devices moved by the carrier path and by the manual setter', () => {
  require('../src/rma');
  const { carrierReturned, returned } = require('../src/returns');
  for (const id of ['d2', 'd1', 'd3']) store.devices.set(id, { id, location: 'stock' });
  store.parcels.set('pA', { id: 'pA', state: 'shipped', deviceId: 'd2' });
  store.parcels.set('pB', { id: 'pB', state: 'shipped', deviceId: 'd1' });
  carrierReturned('pA');
  returned('pB'); // what markReturned (T3) reaches
  assert.deepStrictEqual(rmaList(), ['d1', 'd2']);
});
