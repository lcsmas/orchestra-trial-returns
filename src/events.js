'use strict';
// Tiny in-process event bus shared by every module.
const handlers = {};
function on(name, fn) { (handlers[name] ??= []).push(fn); }
function emit(name, payload) { for (const fn of handlers[name] || []) fn(payload); }
function reset() { for (const k of Object.keys(handlers)) delete handlers[k]; }
module.exports = { on, emit, reset };
