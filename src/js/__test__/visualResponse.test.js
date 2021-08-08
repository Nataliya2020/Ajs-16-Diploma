/**
 * @jest-environment jsdom
 */

import GameController from '../GameController';
import GamePlay from '../GamePlay';
import Bowman from '../Characters/Bowman';
import Daemon from '../Characters/Daemon';
import Swordsman from '../Characters/Swordsman';
import PositionedCharacter from '../PositionedCharacter';

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

window.alert = jest.fn();

test('login api resolves true', () => {
  window.alert.mockClear();
  /* ... */
});

let gamePlay = null;
let gameControl = null;

beforeEach(() => {
  const gameDiv = document.createElement('div');
  gamePlay = new GamePlay();
  gameControl = new GameController(gamePlay);
  gamePlay.bindToDOM(gameDiv);

  gameControl.init();
  gameControl.command = [
    new PositionedCharacter(new Bowman(1, 'bowman'), 0),
    new PositionedCharacter(new Daemon(1, 'undead'), 8),
    new PositionedCharacter(new Swordsman(1, 'bowman'), 15),
  ];
  gameControl.gamePlay.redrawPositions(gameControl.command);
});

test('Checking the presence of a character on your team. If there is, replace the cursor and deselect', () => {
  gameControl.personIndex = 0;
  gameControl.gamePlay.setCursor = jest.fn();
  gameControl.gamePlay.deselectCell = jest.fn();
  gameControl.onCellEnter(15);
  expect(gameControl.gamePlay.deselectCell).toHaveBeenCalledWith(15);
  expect(gameControl.gamePlay.setCursor).toHaveBeenCalledWith('pointer');
});

test('Checking the ability to move into a cell', () => {
  // eslint-disable-next-line prefer-destructuring
  gameControl.personIndex = 0;
  gameControl.gamePlay.selectCell = jest.fn();
  gameControl.gamePlay.setCursor = jest.fn();
  gameControl.onCellEnter(1);
  expect(gameControl.gamePlay.selectCell).toHaveBeenCalledWith(1, 'green');
  expect(gameControl.gamePlay.setCursor).toHaveBeenCalledWith('pointer');
});

test('Checking the possibility of an attack', () => {
  // eslint-disable-next-line prefer-destructuring
  gameControl.personIndex = 0;
  gameControl.gamePlay.selectCell = jest.fn();
  gameControl.gamePlay.setCursor = jest.fn();
  gameControl.onCellEnter(8);

  expect(gameControl.gamePlay.selectCell).toHaveBeenCalledWith(8, 'red');
  expect(gameControl.gamePlay.setCursor).toHaveBeenCalledWith('crosshair');
});

test('Checking the possibility of moving into a cell. If not possible, deselect, replace the cursor', () => {
  // eslint-disable-next-line prefer-destructuring
  gameControl.personIndex = 0;
  gameControl.moveIndex = 40;
  gameControl.gamePlay.selectCell = jest.fn();
  gameControl.gamePlay.setCursor = jest.fn();
  gameControl.gamePlay.deselectCell = jest.fn();
  gameControl.onCellEnter(35);
  expect(gameControl.gamePlay.deselectCell).toHaveBeenCalledWith(40);
  expect(gameControl.gamePlay.setCursor).toHaveBeenCalledWith('not-allowed');
});
