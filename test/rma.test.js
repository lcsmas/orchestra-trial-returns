'use strict';
const test = require('node:test'); const assert = require('node:assert');
const { events, store, rma } = require('../src');

function arm() { events.reset(); store.reset(); events.on('returned', rma.rma); }

test('returned moves device to rma', () => {
  arm();
  store.devices.set('d1', { id: 'd1', location: 'stock' });
  store.parcels.set('p1', { id: 'p1', state: 'returned', deviceId: 'd1' });
  events.emit('returned', 'p1');
  assert.strictEqual(store.devices.get('d1').location, 'rma');
});

test('payload object form works', () => {
  arm();
  store.devices.set('d1', { id: 'd1', location: 'stock' });
  store.parcels.set('p1', { id: 'p1', state: 'returned', deviceId: 'd1' });
  events.emit('returned', { id: 'p1' });
  assert.strictEqual(store.devices.get('d1').location, 'rma');
});

test('no device: no move, no throw', () => {
  arm();
  store.parcels.set('p1', { id: 'p1', state: 'returned' });
  assert.doesNotThrow(() => events.emit('returned', 'p1'));
  assert.doesNotThrow(() => rma.rma('missing'));
});

test('once per parcel', () => {
  arm();
  store.devices.set('d1', { id: 'd1', location: 'stock' });
  store.parcels.set('p1', { id: 'p1', state: 'returned', deviceId: 'd1' });
  events.emit('returned', 'p1');
  store.devices.get('d1').location = 'bench';
  events.emit('returned', 'p1');
  assert.strictEqual(store.devices.get('d1').location, 'bench');
});
