'use strict';
const test = require('node:test'); const assert = require('node:assert');
const { events } = require('../src');
test('bus', () => { let n = 0; events.on('x', () => n++); events.emit('x'); assert.strictEqual(n, 1); events.reset(); });
