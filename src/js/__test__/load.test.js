/**
 * @jest-environment jsdom
 */

import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

window.alert = jest.fn();

test('login api resolves true', () => {
  window.alert.mockClear();
  /* ... */
});

let saveService = null;

beforeEach(() => {
  saveService = new GameStateService();
});

test('Error loading', () => {
  const loadMock = jest.fn(() => GamePlay.showMessage('Invalid state'));
  try {
    saveService.load();
  } catch (err) {
    loadMock();
  }
  expect(loadMock).toHaveBeenCalled();
});
