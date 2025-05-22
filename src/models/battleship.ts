// Models for Battleship game

export type CellState = 'empty' | 'ship' | 'hit' | 'miss';

export interface Ship {
  id: number;
  size: number;
  positions: [number, number][];
  hits: number;
}

export interface Board {
  size: number;
  grid: CellState[][];
  ships: Ship[];
}

export interface GameState {
  playerBoard: Board;
  computerBoard: Board;
  gameStatus: 'setup' | 'playing' | 'playerWon' | 'computerWon';
  playerTurn: boolean;
  selectedShipId: number | null;
  shipPlacementOrientation: 'horizontal' | 'vertical';
}

export const SHIP_SIZES = [5, 4, 3, 3, 2]; // Carrier, Battleship, Cruiser, Submarine, Destroyer

export const createEmptyBoard = (size = 10): Board => {
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
    grid: [...board.grid.map((row) => [...row])],
    ships: [...board.ships]
  };

  const positions: [number, number][] = [];

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
    grid: [...board.grid.map((row) => [...row])],
    ships: [...board.ships.map((ship) => ({ ...ship }))]
  };

  if (board.grid[row][col] === 'ship') {
    // It's a hit!
    newBoard.grid[row][col] = 'hit';

    // Find which ship was hit
    const hitShipIndex = board.ships.findIndex((ship) =>
      ship.positions.some(
        ([shipRow, shipCol]) => shipRow === row && shipCol === col
      )
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
  return board.ships.every((ship) => ship.hits === ship.size);
};

// Track computer's last successful hit
let lastSuccessfulHits: [number, number][] = [];
let targetMode = false;
let currentDirections: ('up' | 'right' | 'down' | 'left')[] = [];

// Computer AI to make a move
export const computerMove = (board: Board): [number, number] => {
  const { size, grid } = board;

  // Reset targeting if we don't have any successful hits to follow up on
  if (lastSuccessfulHits.length === 0) {
    targetMode = false;
  }

  // If we have a hit, try adjacent cells
  if (targetMode && lastSuccessfulHits.length > 0) {
    // Take the most recent hit as reference
    const [hitRow, hitCol] = lastSuccessfulHits[lastSuccessfulHits.length - 1];

    // If we have more than one hit in a line, determine the direction
    if (lastSuccessfulHits.length >= 2) {
      const [previousHitRow, previousHitCol] =
        lastSuccessfulHits[lastSuccessfulHits.length - 2];

      // Determine direction of multiple hits (horizontal or vertical)
      if (hitRow === previousHitRow) {
        // Horizontal ship
        currentDirections = ['left', 'right'];
      } else if (hitCol === previousHitCol) {
        // Vertical ship
        currentDirections = ['up', 'down'];
      }
    }

    // Try directions from the current hit
    if (currentDirections.length === 0) {
      currentDirections = ['up', 'right', 'down', 'left'];
    }

    // Shuffle the directions to avoid predictable patterns
    const shuffledDirections = [...currentDirections].sort(
      () => Math.random() - 0.5
    );

    for (const direction of shuffledDirections) {
      let targetRow = hitRow;
      let targetCol = hitCol;

      switch (direction) {
        case 'up':
          targetRow -= 1;
          break;
        case 'right':
          targetCol += 1;
          break;
        case 'down':
          targetRow += 1;
          break;
        case 'left':
          targetCol -= 1;
          break;
      }

      // Check if target is valid and hasn't been targeted before
      if (
        targetRow >= 0 &&
        targetRow < size &&
        targetCol >= 0 &&
        targetCol < size &&
        grid[targetRow][targetCol] !== 'hit' &&
        grid[targetRow][targetCol] !== 'miss'
      ) {
        return [targetRow, targetCol];
      }
    }
  }

  // If targeting fails or we're in hunt mode, make a random move
  let row, col;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  // Use a "checkerboard" pattern for efficiency when hunting
  do {
    if (attempts % 2 === 0) {
      // On even attempts, use checkerboard pattern
      row = Math.floor(Math.random() * size);
      col =
        row % 2 === 0
          ? Math.floor(Math.random() * Math.ceil(size / 2)) * 2
          : Math.floor(Math.random() * Math.floor(size / 2)) * 2 + 1;
    } else {
      // On odd attempts, use pure random as fallback
      row = Math.floor(Math.random() * size);
      col = Math.floor(Math.random() * size);
    }
    attempts++;
  } while (
    (grid[row][col] === 'hit' || grid[row][col] === 'miss') &&
    attempts < maxAttempts
  );

  // In case we couldn't find a move with the pattern, fallback to first available
  if (attempts >= maxAttempts) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] !== 'hit' && grid[r][c] !== 'miss') {
          return [r, c];
        }
      }
    }
  }

  return [row, col];
};

// Process computer's shot result
export const processComputerMove = (
  hit: boolean,
  row: number,
  col: number,
  shipSunk?: boolean
): void => {
  if (hit) {
    // Add this hit to our list of successful hits
    lastSuccessfulHits.push([row, col]);
    targetMode = true;
  } else if (targetMode) {
    // If we missed while targeting, remove the direction we just tried
    // This part is tricky as we don't explicitly store the last direction tried for a specific hit.
    // For now, if it's a miss in target mode, we might have hit the end of a ship or an empty space.
    // The current logic will make it try other directions from the last hit, or eventually revert to hunt.
  }

  if (shipSunk) {
    // If we sink a ship, reset targeting
    lastSuccessfulHits = [];
    targetMode = false;
    currentDirections = [];
  }
};
