'use strict';
const test = require('node:test'); const assert = require('node:assert');
const { events, store } = require('../src');
const { carrierReturned, returned } = require('../src/returns');

test.beforeEach(() => { events.reset(); store.reset(); store.parcels.set('p1', { id: 'p1', state: 'shipped', deviceId: 'd1' }); });

test('carrierReturned sets state to returned and emits', () => {
  const seen = []; events.on('returned', (e) => seen.push(e.parcelId));
  carrierReturned('p1');
  assert.strictEqual(store.parcels.get('p1').state, 'returned');
  assert.deepStrictEqual(seen, ['p1']);
});
test('second call changes nothing, no second effect', () => {
  let n = 0; events.on('returned', () => n++);
  carrierReturned('p1'); carrierReturned('p1');
  assert.strictEqual(n, 1);
  assert.strictEqual(store.parcels.get('p1').state, 'returned');
});
test('returned() (manual path) is idempotent and emits too', () => {
  let n = 0; events.on('returned', () => n++);
  returned('p1'); returned('p1'); carrierReturned('p1');
  assert.strictEqual(n, 1);
});
test('unknown parcel throws, no emit', () => {
  let n = 0; events.on('returned', () => n++);
  assert.throws(() => carrierReturned('nope'));
  assert.throws(() => returned('nope'));
  assert.strictEqual(n, 0);
});
