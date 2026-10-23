import test from 'node:test';
import assert from 'node:assert/strict';

// Polyfill localStorage for node environment before importing store
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    length: 0,
  } as unknown as Storage;
}

import { sirhStore } from './sirhStore';

test('sirhStore initializes with required data blocks', () => {
  const state = sirhStore.getState();
  assert.ok(state.departements.length > 0, 'departements should exist');
  assert.ok(state.services.length > 0, 'services should exist');
  assert.ok(state.postes.length > 0, 'postes should exist');
  assert.ok(state.demandes.length > 0, 'demandes should exist');
  assert.equal(state.currentRole, 'RH', 'default role should be RH');
});

test('sirhStore switches user roles and selects correct user', () => {
  sirhStore.switchRole('FINANCE');
  let state = sirhStore.getState();
  assert.equal(state.currentRole, 'FINANCE');
  assert.equal(state.currentUser.role, 'FINANCE');

  sirhStore.switchRole('DIRECTION');
  state = sirhStore.getState();
  assert.equal(state.currentRole, 'DIRECTION');

  // Reset back to RH
  sirhStore.switchRole('RH');
  assert.equal(sirhStore.getState().currentRole, 'RH');
});

test('sirhStore logs movements in audit trail', () => {
  const initialAuditCount = sirhStore.getState().journal.length;
  sirhStore.logMouvement('TEST_ENTITY', 'test-id-1', 'TEST_ACTION', null, { status: 'OK' }, 'Test log');
  const updatedState = sirhStore.getState();
  assert.equal(updatedState.journal.length, initialAuditCount + 1);
  assert.equal(updatedState.journal[0].action, 'TEST_ACTION');
  assert.equal(updatedState.journal[0].entite, 'TEST_ENTITY');
});

test('sirhStore creates and marks notifications as read', () => {
  sirhStore.pushNotification('Test Notification', 'Ceci est un test', 'INFO', 'RH', 'bloc1');
  const state = sirhStore.getState();
  const created = state.notifications[0];
  assert.equal(created.titre, 'Test Notification');
  assert.equal(created.lu, false);

  sirhStore.markNotificationRead(created.id);
  const afterReadState = sirhStore.getState();
  const readItem = afterReadState.notifications.find((n) => n.id === created.id);
  assert.equal(readItem?.lu, true);
});
