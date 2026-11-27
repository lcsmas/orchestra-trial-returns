'use strict';
const test = require('node:test'); const assert = require('node:assert');
const { store, events } = require('../src');
const { markReturned } = require('../src/admin');
const { carrierReturned } = require('../src/returns');
function seed(id = 'p1') {
  store.reset();
  store.devices.set('d1', { id: 'd1', location: 'customer' });
  store.parcels.set(id, { id, state: 'shipped', deviceId: 'd1' });
}
// The bus has no off(): one permanent collector, swapped per call.
let sink = null;
events.on('returned', (e) => sink?.push(e));
function emitted(fn) { const seen = []; sink = seen; try { fn(); } finally { sink = null; } return seen; }

test('markReturned sets the parcel state to returned', () => {
  seed(); markReturned('p1');
  assert.strictEqual(store.parcels.get('p1').state, 'returned');
});

test('markReturned emits the same returned signal as a carrier return', () => {
  seed(); const manual = emitted(() => markReturned('p1'));
  seed(); const carrier = emitted(() => carrierReturned('p1'));
  assert.strictEqual(manual.length, 1);
  assert.strictEqual(manual[0].parcelId, 'p1');
  assert.deepStrictEqual(Object.keys(manual[0]).sort(), Object.keys(carrier[0]).sort());
});

test('marking an already returned parcel emits nothing more', () => {
  seed(); markReturned('p1');
  const again = emitted(() => { markReturned('p1'); carrierReturned('p1'); });
  assert.strictEqual(again.length, 0);
  assert.strictEqual(store.parcels.get('p1').state, 'returned');
});

test('unknown parcel id throws', () => {
  store.reset();
  assert.throws(() => markReturned('nope'));
});
