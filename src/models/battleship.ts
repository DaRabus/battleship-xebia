// Models for Battleship game

export type CellState = 'empty' | 'ship' | 'hit' | 'miss';

export type Ship = {
  id: number;
  size: number;
  positions: Array<[number, number]>;
  hits: number;
};

export type Board = {
  size: number;
  grid: CellState[][];
  ships: Ship[];
};

export type GameState = {
  playerBoard: Board;
  computerBoard: Board;
  gameStatus: 'setup' | 'playing' | 'playerWon' | 'computerWon';
  playerTurn: boolean;
  selectedShipId: number | null;
  shipPlacementOrientation: 'horizontal' | 'vertical';
};

export const SHIP_SIZES = [5, 4, 3, 3, 2]; // Carrier, Battleship, Cruiser, Submarine, Destroyer

export const createEmptyBoard = (size: number = 10): Board => {
  const grid: CellState[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill('empty'));

  return {
    size,
    grid,
    ships: []
  };
};

export const initialGameState: GameState = {
  playerBoard: createEmptyBoard(),
  computerBoard: createEmptyBoard(),
  gameStatus: 'setup',
  playerTurn: true,
  selectedShipId: 0,
  shipPlacementOrientation: 'horizontal'
};

// Check if a ship can be placed at the given position with the given orientation
export const canPlaceShip = (
  board: Board,
  shipSize: number,
  startRow: number,
  startCol: number,
  orientation: 'horizontal' | 'vertical'
): boolean => {
  const { size, grid } = board;

  // Check if the ship fits within the board boundaries
  if (
    (orientation === 'horizontal' && startCol + shipSize > size) ||
    (orientation === 'vertical' && startRow + shipSize > size)
  ) {
    return false;
  }

  // Check if the ship overlaps with any existing ships
  // Also check adjacent cells (ships cannot touch)
  for (let i = -1; i <= shipSize; i++) {
    for (let j = -1; j <= 1; j++) {
      let row = startRow;
      let col = startCol;

      if (orientation === 'horizontal') {
        row += j;
        col += i;
      } else {
        row += i;
        col += j;
      }

      // Skip if out of bounds
      if (row < 0 || row >= size || col < 0 || col >= size) continue;

      // Check if there's a ship at this location
      if (grid[row][col] === 'ship') return false;
    }
  }

  return true;
};

// Place a ship on the board
export const placeShip = (
  board: Board,
  shipId: number,
  shipSize: number,
  startRow: number,
  startCol: number,
  orientation: 'horizontal' | 'vertical'
): Board => {
  if (!canPlaceShip(board, shipSize, startRow, startCol, orientation)) {
    return board;
  }

  const newBoard = {
    ...board,
    grid: [...board.grid.map(row => [...row])],
    ships: [...board.ships]
  };

  const positions: Array<[number, number]> = [];

  for (let i = 0; i < shipSize; i++) {
    const row = orientation === 'horizontal' ? startRow : startRow + i;
    const col = orientation === 'horizontal' ? startCol + i : startCol;
    newBoard.grid[row][col] = 'ship';
    positions.push([row, col]);
  }

  newBoard.ships.push({
    id: shipId,
    size: shipSize,
    positions,
    hits: 0
  });

  return newBoard;
};

// Process a shot at the given coordinates
export const processShot = (
  board: Board,
  row: number,
  col: number
): { updatedBoard: Board; hit: boolean; shipDestroyed?: Ship } => {
  if (row < 0 || row >= board.size || col < 0 || col >= board.size) {
    return { updatedBoard: board, hit: false };
  }

  const newBoard = {
    ...board,
    grid: [...board.grid.map(row => [...row])],
    ships: [...board.ships.map(ship => ({ ...ship }))]
  };

  if (board.grid[row][col] === 'ship') {
    // It's a hit!
    newBoard.grid[row][col] = 'hit';

    // Find which ship was hit
    const hitShipIndex = board.ships.findIndex(ship =>
      ship.positions.some(([shipRow, shipCol]) => shipRow === row && shipCol === col)
    );

    if (hitShipIndex >= 0) {
      newBoard.ships[hitShipIndex].hits++;

      const hitShip = newBoard.ships[hitShipIndex];

      // Check if ship is destroyed
      if (hitShip.hits === hitShip.size) {
        return { updatedBoard: newBoard, hit: true, shipDestroyed: hitShip };
      }
    }

    return { updatedBoard: newBoard, hit: true };
  } else if (board.grid[row][col] === 'empty') {
    // It's a miss
    newBoard.grid[row][col] = 'miss';
    return { updatedBoard: newBoard, hit: false };
  }

  // Already hit or miss
  return { updatedBoard: board, hit: false };
};

// Generate random placements for computer ships
export const generateComputerBoard = (): Board => {
  let board = createEmptyBoard();

  SHIP_SIZES.forEach((size, index) => {
    let placed = false;
    while (!placed) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * board.size);
      const col = Math.floor(Math.random() * board.size);

      if (canPlaceShip(board, size, row, col, orientation)) {
        board = placeShip(board, index, size, row, col, orientation);
        placed = true;
      }
    }
  });

  return board;
};

// Check if all ships are destroyed
export const checkGameOver = (board: Board): boolean => {
  return board.ships.every(ship => ship.hits === ship.size);
};

// Computer AI to make a move
export const computerMove = (board: Board): [number, number] => {
  // Simple random strategy for now
  // A more advanced AI would target around hits
  const { size, grid } = board;
  let row, col;

  do {
    row = Math.floor(Math.random() * size);
    col = Math.floor(Math.random() * size);
  } while (grid[row][col] === 'hit' || grid[row][col] === 'miss');

  return [row, col];
};
