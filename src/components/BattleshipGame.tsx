'use client';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import Image from 'next/image';
import { CellState } from '@models/battleship';
import { SHIP_SIZES } from '@models/battleship';
import { ICONS } from '@react-ui-kit/icons/icon-paths';

interface CellProps {
  state: CellState;
  row: number;
  col: number;
  isSetup: boolean;
  isPlayerBoard: boolean;
  onClick: () => void;
};

const Cell = ({ state, row, col, isSetup, isPlayerBoard, onClick }: CellProps) => {
  // Define color based on cell state
  let backgroundColor = '#e0e0e0'; // Empty cell
  let content = '';
  let isHit = false;

  if (state === 'ship' && isPlayerBoard) {
    backgroundColor = '#64b5f6'; // Ship - blue
  } else if (state === 'hit') {
    backgroundColor = '#e53935'; // Hit - red
    isHit = true;
  } else if (state === 'miss') {
    backgroundColor = '#9e9e9e'; // Miss - gray
    content = '•';
  }

  // During setup, we should show the player's ships but not the computer's
  // During gameplay, we should not reveal unshot computer ships
  const showCell = isPlayerBoard || state === 'hit' || state === 'miss' || isSetup;

  return (
    <Box
      className={`flex items-center justify-center w-9 h-9 border border-gray-300 text-xl font-bold transition-colors ${
        (isSetup && isPlayerBoard) || (!isSetup && !isPlayerBoard)
          ? 'cursor-pointer'
          : 'cursor-default'
      }`}
      sx={{
        backgroundColor,
      }}
      onClick={onClick}
    >
      {isHit ? (
        <Image
          src={ICONS.GITHUB}
          alt="Hit"
          className="w-6 h-6 filter invert animate-pulse"
          width={24}
          height={24}
        />
      ) : (
        content
      )}
    </Box>
  );
};

interface BoardProps {
  grid: CellState[][];
  isPlayerBoard: boolean;
  isSetup: boolean;
  onCellClick: (row: number, col: number) => void;
}

const Board = ({ grid, isPlayerBoard, isSetup, onCellClick }: BoardProps) => {
  return (
    <Paper elevation={3} className="p-4 mb-6">
      <Box className="flex flex-col">
        {/* Column labels */}
        <Box className="flex pl-7 mb-1">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <Box key={`col-${i}`} className="w-9 h-6 flex items-center justify-center font-bold text-gray-600">
                {String.fromCharCode(65 + i)}
              </Box>
            ))}
        </Box>

        {grid.map((row, rowIndex) => (
          <Box key={`row-${rowIndex}`} className="flex items-center">
            {/* Row label */}
            <Box className="w-9 h-6 flex items-center justify-center font-bold text-gray-600">{rowIndex + 1}</Box>

            {row.map((cellState, colIndex) => (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                state={cellState}
                row={rowIndex}
                col={colIndex}
                isSetup={isSetup}
                isPlayerBoard={isPlayerBoard}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

interface ShipSelectorProps {
  selectedShipId: number | null;
  orientation: 'horizontal' | 'vertical';
  onToggleOrientation: () => void;
  onAutoPlace: () => void;
}

const ShipSelector = ({
  selectedShipId,
  orientation,
  onToggleOrientation,
  onAutoPlace
}: ShipSelectorProps) => {
  const shipNames = [
    'Carrier',
    'Battleship',
    'Cruiser',
    'Submarine',
    'Destroyer'
  ];

  return (
    <Box className="mb-2">
      <Typography variant="h6" gutterBottom>
        Ship Placement
      </Typography>

      {selectedShipId !== null ? (
        <Box>
          <Typography>
            Currently placing: {shipNames[selectedShipId]} ({SHIP_SIZES[selectedShipId]} spaces)
          </Typography>
          <Typography>
            Orientation: {orientation}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onToggleOrientation}
            className="mr-2 mt-1"
          >
            Rotate Ship
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onAutoPlace}
            className="mt-1"
          >
            Auto-Place All
          </Button>
        </Box>
      ) : (
        <Typography>All ships placed</Typography>
      )}
    </Box>
  );
};

interface BattleshipGameProps {
  gameState: {
    gameStatus: 'setup' | 'playing' | 'playerWon' | 'computerWon';
    playerTurn: boolean;
    playerBoard: { grid: CellState[][] };
    computerBoard: { grid: CellState[][] };
    selectedShipId: number | null;
    shipPlacementOrientation: 'horizontal' | 'vertical';
  };
  message: string;
  onPlaceShip: (row: number, col: number) => void;
  onShoot: (row: number, col: number) => void;
  onResetGame: () => void;
  onToggleOrientation: () => void;
  onAutoPlace: () => void;
}

export const BattleshipGame = ({
  gameState,
  message,
  onPlaceShip,
  onShoot,
  onResetGame,
  onToggleOrientation,
  onAutoPlace
}: BattleshipGameProps) => {
  const isSetup = gameState.gameStatus === 'setup';
  const isGameOver = gameState.gameStatus === 'playerWon' || gameState.gameStatus === 'computerWon';

  // Function to completely clear localStorage and reset the game
  const handleClearStorage = () => {
    localStorage.clear();
    onResetGame();
    window.location.reload(); // Force reload to ensure clean state
  };

  const handlePlayerBoardClick = (row: number, col: number) => {
    if (isSetup) {
      onPlaceShip(row, col);
    }
  };

  const handleComputerBoardClick = (row: number, col: number) => {
    if (!isSetup && gameState.playerTurn) {
      onShoot(row, col);
    }
  };

  return (
    <Box className="p-2">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4">Battleship Game</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleClearStorage}
          size="small"
        >
          Clear Game Data
        </Button>
      </Box>

      <Typography
        variant="h6"
        gutterBottom
        color={
          message.includes('Hit') || message.includes('sunk')
            ? 'error'
            : message.includes('won')
              ? 'success'
              : 'textPrimary'
        }
      >
        {message}
      </Typography>

      {!isGameOver && isSetup && (
        <ShipSelector
          selectedShipId={gameState.selectedShipId}
          orientation={gameState.shipPlacementOrientation}
          onToggleOrientation={onToggleOrientation}
          onAutoPlace={onAutoPlace}
        />
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Your Fleet
          </Typography>
          <Board
            grid={gameState.playerBoard.grid}
            isPlayerBoard={true}
            isSetup={isSetup}
            onCellClick={handlePlayerBoardClick}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Enemy Waters
          </Typography>
          <Board
            grid={gameState.computerBoard.grid}
            isPlayerBoard={false}
            isSetup={isSetup}
            onCellClick={handleComputerBoardClick}
          />
        </Grid>
      </Grid>

      {isGameOver && (
        <Box className="mt-3 text-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onResetGame}
          >
            Start New Game
          </Button>
        </Box>
      )}
    </Box>
  );
};
