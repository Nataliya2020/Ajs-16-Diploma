export function calcTileType(index, boardSize) {
  // TODO: write logic here

  if (index === 0) {
    return 'top-left';
  }

  if (index < boardSize - 1) {
    return 'top';
  }

  if (index === boardSize - 1) {
    return 'top-right';
  }

  const sizeBoard = boardSize * boardSize;

  if (index % boardSize === 0 && (index + boardSize) < sizeBoard) {
    return 'left';
  }
  if (index % boardSize === 0 && (index + boardSize) >= sizeBoard) {
    return 'bottom-left';
  }

  if (index === sizeBoard - 1) {
    return 'bottom-right';
  }

  if ((index + 1) % boardSize === 0) {
    return 'right';
  }

  if (index < sizeBoard - 1 && index > sizeBoard - boardSize) {
    return 'bottom';
  }

  if (index < sizeBoard - 1) {
    return 'center';
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
