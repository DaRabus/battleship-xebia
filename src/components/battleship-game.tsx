'use client';
import { useEffect, useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import type { CellState } from '@models/battleship';
import { SHIP_SIZES } from '@models/battleship';
import { ICONS } from '@react-ui-kit/icons/icon-paths';
import { BattleshipStats } from './battleship-stats';
import Confetti from 'react-confetti';

interface CellProps {
  state: CellState;
  row: number;
  col: number;
  isSetup: boolean;
  isPlayerBoard: boolean;
  onClick: () => void;
}

const Cell = ({
  state,
  row,
  col,
  isSetup,
  isPlayerBoard,
  onClick
}: CellProps) => {
  // Define color based on cell state
  let backgroundColor = '#e0e0e0'; // Empty cell
  let isHit = false;
  let isMiss = false;

  if (state === 'ship' && isPlayerBoard) {
    backgroundColor = '#64b5f6'; // Ship - blue
  } else if (state === 'hit') {
    backgroundColor = '#e53935'; // Hit - red
    isHit = true;
  } else if (state === 'miss') {
    backgroundColor = '#9e9e9e'; // Miss - gray
    isMiss = true;
  }

  // During setup, we should show the player's ships but not the computer's
  // During gameplay, we should not reveal unshot computer ships
  // Note: We're directly using the backgroundColor now instead of this variable
  // Keeping this for potential future visibility control
  // const showCell = isPlayerBoard || state === 'hit' || state === 'miss' || isSetup;

  return (
    <Box
      className={`flex items-center justify-center w-9 h-9 border border-gray-300 text-xl font-bold transition-colors ${
        (isSetup && isPlayerBoard) || (!isSetup && !isPlayerBoard)
          ? 'cursor-pointer'
          : 'cursor-default'
      }`}
      sx={{
        backgroundColor
      }}
      onClick={onClick}
    >
      {isHit ? (
        <div className="hit-marker">
          <Image
            src={ICONS.GITHUB}
            alt="Hit"
            className="w-6 h-6 filter invert animate-pulse"
            width={24}
            height={24}
            priority
            onError={(e) => {
              // Simple fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Display a simple hit marker that works everywhere
              target.parentElement?.insertAdjacentHTML(
                'beforeend',
                '<span>💥</span>'
              );
            }}
          />
        </div>
      ) : isMiss ? (
        <div className="miss-marker">
          <span className="text-white font-bold text-xl">•</span>
        </div>
      ) : (
        ''
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
              <Box
                key={`col-${i}`}
                className="w-9 h-6 flex items-center justify-center font-bold text-gray-600"
              >
                {String.fromCharCode(65 + i)}
              </Box>
            ))}
        </Box>

        {grid.map((row, rowIndex) => (
          <Box key={`row-${rowIndex}`} className="flex items-center">
            {/* Row label */}
            <Box className="w-9 h-6 flex items-center justify-center font-bold text-gray-600">
              {rowIndex + 1}
            </Box>

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
            Currently placing: {shipNames[selectedShipId]} (
            {SHIP_SIZES[selectedShipId]} spaces)
          </Typography>
          <Typography>Orientation: {orientation}</Typography>
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

// New component for visualizing ships
interface ShipDisplayProps {
  shipId: number;
  size: number;
  isPlaced: boolean;
  isSelected: boolean;
  orientation: 'horizontal' | 'vertical';
}

const ShipDisplay = ({
  shipId,
  size,
  isPlaced,
  isSelected,
  orientation
}: ShipDisplayProps) => {
  const shipNames = [
    'Carrier',
    'Battleship',
    'Cruiser',
    'Submarine',
    'Destroyer'
  ];

  return (
    <Box
      className={`p-1 border ${
        isSelected
          ? 'border-yellow-500 bg-yellow-50'
          : isPlaced
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-100'
      } rounded mb-2`}
    >
      <Typography variant="body2" color="black" className="font-bold mb-1">
        {shipNames[shipId]} ({size} spaces)
      </Typography>
      <Box
        className={`flex ${
          orientation === 'vertical' ? 'flex-col' : 'flex-row'
        } gap-0.5`}
      >
        {Array(size)
          .fill(0)
          .map((_, i) => (
            <Box
              key={`ship-${shipId}-cell-${i}`}
              className="w-6 h-6 bg-blue-500 border border-blue-600"
            />
          ))}
      </Box>
      <Typography
        variant="body2"
        className={`mt-1 ${isPlaced ? 'text-green-600' : 'text-gray-600'}`}
      >
        {isPlaced ? 'Placed' : 'Not placed'}
      </Typography>
    </Box>
  );
};

interface ShipsListProps {
  ships: {
    id: number;
    size: number;
    positions: [number, number][];
  }[];
  selectedShipId: number | null;
  orientation: 'horizontal' | 'vertical';
}

const ShipsList = ({ ships, selectedShipId, orientation }: ShipsListProps) => {
  const placedShips = new Set(ships.map((ship) => ship.id));

  return (
    <Paper elevation={2} className="p-4 mb-4">
      <Typography variant="h6" gutterBottom className="border-b pb-2 mb-2">
        Your Ships
      </Typography>
      <Grid container spacing={2}>
        {SHIP_SIZES.map((size, index) => (
          <Grid item xs={6} sm={4} md={4} lg={2} key={`ship-info-${index}`}>
            <ShipDisplay
              shipId={index}
              size={size}
              isPlaced={placedShips.has(index)}
              isSelected={selectedShipId === index}
              orientation={orientation}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

interface BattleshipGameProps {
  gameState: {
    gameStatus: 'setup' | 'playing' | 'playerWon' | 'computerWon';
    playerTurn: boolean;
    playerBoard: {
      grid: CellState[][];
      ships: {
        id: number;
        size: number;
        positions: [number, number][];
        hits: number;
      }[];
    };
    computerBoard: {
      grid: CellState[][];
      ships: {
        id: number;
        size: number;
        positions: [number, number][];
        hits: number;
      }[];
    };
    selectedShipId: number | null;
    shipPlacementOrientation: 'horizontal' | 'vertical';
  };
  message: string;
  onPlaceShip: (row: number, col: number) => void;
  onShoot: (row: number, col: number) => void;
  onResetGame: () => void;
  onToggleOrientation: () => void;
  onAutoPlace: () => void;
  onAutoShoot: () => void;
}

export const BattleshipGame = ({
  gameState,
  message,
  onPlaceShip,
  onShoot,
  onResetGame,
  onToggleOrientation,
  onAutoPlace,
  onAutoShoot
}: BattleshipGameProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (gameState.gameStatus === 'playerWon') {
      setShowConfetti(true);
    }
  }, [gameState.gameStatus]);
  const isSetup = gameState.gameStatus === 'setup';
  const isGameOver =
    gameState.gameStatus === 'playerWon' ||
    gameState.gameStatus === 'computerWon';

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
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4">Battleship Game</Typography>
        <Box className="flex items-center space-x-2">
          <Button
            variant="contained"
            color="error"
            onClick={handleClearStorage}
            size="small"
          >
            Clear Game Data
          </Button>
        </Box>
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

      {/* Ship list visualization */}
      <ShipsList
        ships={gameState.playerBoard.ships}
        selectedShipId={gameState.selectedShipId}
        orientation={gameState.shipPlacementOrientation}
      />

      {!isGameOver && isSetup && (
        <ShipSelector
          selectedShipId={gameState.selectedShipId}
          orientation={gameState.shipPlacementOrientation}
          onToggleOrientation={onToggleOrientation}
          onAutoPlace={onAutoPlace}
        />
      )}

      {/* Show battle statistics when game is playing or over */}
      {!isSetup && (
        <BattleshipStats
          playerBoard={gameState.playerBoard}
          computerBoard={gameState.computerBoard}
        />
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Your Fleet
            {!isSetup &&
              gameState.gameStatus === 'playing' &&
              !gameState.playerTurn && (
                <span className="ml-2 text-sm font-normal text-red-600 animate-pulse">
                  (Enemy targeting...)
                </span>
              )}
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
            {!isSetup &&
              gameState.gameStatus === 'playing' &&
              gameState.playerTurn && (
                <span className="ml-2 text-sm font-normal text-blue-600 animate-pulse">
                  (Your turn!)
                </span>
              )}
          </Typography>
          <Board
            grid={gameState.computerBoard.grid}
            isPlayerBoard={false}
            isSetup={isSetup}
            onCellClick={handleComputerBoardClick}
          />
          {/* Auto-Shoot Button under Enemy Board */}
          {gameState.playerTurn && gameState.gameStatus === 'playing' && (
            <Box className="mt-2 text-center">
              <Button
                variant="contained"
                color="secondary"
                onClick={onAutoShoot}
                size="medium"
              >
                Auto-Shoot
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {isGameOver && (
        <Box className="mt-3">
          <Typography variant="h5" className="text-center mb-3">
            {gameState.gameStatus === 'playerWon'
              ? 'Congratulations on your victory!'
              : 'Better luck next time!'}
          </Typography>

          <Box className="text-center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onResetGame}
              className="mb-4"
            >
              Start New Game
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
