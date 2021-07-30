import { calcTileType, calcHealthLevel } from '../utils';

test.each([[0, 8, 'top-left'], [0, 13, 'top-left']])('checking if the image of the upper left corner is correct', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[7, 8, 'top-right'], [12, 13, 'top-right']])('checking if the image of the upper right corner is correct', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[56, 8, 'bottom-left'], [156, 13, 'bottom-left']])('checking the correctness of the image of the lower left corner', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[63, 8, 'bottom-right'], [168, 13, 'bottom-right']])('checking the correctness of the image of the lower right corner', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[24, 8, 'left'], [130, 13, 'left']])('checking if the image of the left side is correct', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[31, 8, 'right'], [142, 13, 'right']])('verifying that the right side is correctly imaged', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[61, 8, 'bottom'], [163, 13, 'bottom']])('checking the correctness of the bottom image', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[20, 8, 'center'], [124, 13, 'center']])('checking the correctness of the image of the center', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[6, 8, 'top'], [11, 13, 'top']])('checking the correctness of the image of the top', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test.each([[65, 8, 'center'], [170, 13, 'center']])('checking the correctness of the image of the top', (position, sizeNumber, expected) => {
  const result = calcTileType(position, sizeNumber);
  expect(result).toBe(expected);
});

test('health check less than 15', () => {
  const res = calcHealthLevel(13);
  expect(res).toBe('critical');
});

test('health check from 16 to 50', () => {
  const res = calcHealthLevel(30);
  expect(res).toBe('normal');
});

test('health check from 50', () => {
  const res = calcHealthLevel(80);
  expect(res).toBe('high');
});
