'use client';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import type { GameState } from '@models/battleship';
import {
  checkGameOver,
  computerMove,
  initialGameState,
  processShot
} from '@models/battleship';

const BATTLESHIP_STATE_KEY = 'battleship-game-state';

export const useBattleshipGame = () => {
  const [gameState, setGameState] = useLocalStorage<GameState>(
    BATTLESHIP_STATE_KEY,
    initialGameState
  );

  const [message, setMessage] = useState<string>('');

  // Reset the game
  const resetGame = () => {
    setGameState(initialGameState);
    setMessage('Welcome to Battleship! Place your ships on the board.');
  };

  // Place a ship on the player's board
  const placePlayerShip = (row: number, col: number) => {
    if (gameState.gameStatus !== 'setup') return;

    const { selectedShipId, shipPlacementOrientation, playerBoard } = gameState;
    if (selectedShipId === null) return;

    import('@models/battleship').then(
      ({ SHIP_SIZES, placeShip, canPlaceShip }) => {
        const shipSize = SHIP_SIZES[selectedShipId];

        if (
          !canPlaceShip(
            playerBoard,
            shipSize,
            row,
            col,
            shipPlacementOrientation
          )
        ) {
          setMessage(
            'Cannot place ship here. Try another location or orientation.'
          );
          return;
        }

        const updatedBoard = placeShip(
          playerBoard,
          selectedShipId,
          shipSize,
          row,
          col,
          shipPlacementOrientation
        );

        const nextShipId =
          selectedShipId < SHIP_SIZES.length - 1 ? selectedShipId + 1 : null;

        setGameState((prevState) => ({
          ...prevState,
          playerBoard: updatedBoard,
          selectedShipId: nextShipId,
          gameStatus: nextShipId === null ? 'playing' : 'setup'
        }));

        if (nextShipId === null) {
          setMessage('All ships placed! Game is starting. Take your shot!');
        } else {
          setMessage(`Place your ${getShipName(nextShipId)}.`);
        }
      }
    );
  };

  // Player takes a shot
  const playerShoot = async (row: number, col: number) => {
    if (!gameState.playerTurn || gameState.gameStatus !== 'playing') return;

    import('@models/battleship').then(
      async ({ processShot, checkGameOver, computerMove }) => {
        const { hit, shipDestroyed, updatedBoard } = processShot(
          gameState.computerBoard,
          row,
          col
        );

        const updatedGameState = {
          ...gameState,
          computerBoard: updatedBoard,
          playerTurn: false
        };

        if (hit) {
          setMessage(
            shipDestroyed
              ? `You sunk the enemy's ${getShipName(shipDestroyed.id)}!`
              : 'Hit!'
          );

          if (checkGameOver(updatedBoard)) {
            updatedGameState.gameStatus = 'playerWon';
            setMessage('Congratulations! You won!');
          }
        } else {
          setMessage("Miss! Computer's turn.");
        }

        setGameState(updatedGameState);

        // If game is still going, let computer take a turn
        if (updatedGameState.gameStatus === 'playing') {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Add delay

          const [computerRow, computerCol] = computerMove(
            gameState.playerBoard
          );
          const computerResult = processShot(
            gameState.playerBoard,
            computerRow,
            computerCol
          );

          // Update computer AI with the result of its move
          import('@models/battleship').then(({ processComputerMove }) => {
            processComputerMove(computerResult.hit, computerRow, computerCol);
          });

          const afterComputerGameState = {
            ...updatedGameState,
            playerBoard: computerResult.updatedBoard,
            playerTurn: true
          };

          if (computerResult.hit) {
            setMessage(
              computerResult.shipDestroyed
                ? `Computer sunk your ${getShipName(computerResult.shipDestroyed.id)}!`
                : 'Computer hit your ship!'
            );

            if (checkGameOver(computerResult.updatedBoard)) {
              afterComputerGameState.gameStatus = 'computerWon';
              setMessage('Computer won! Better luck next time.');
            }
          } else {
            setMessage('Computer missed. Your turn!');
          }

          setGameState(afterComputerGameState);
        }
      }
    );
  };

  // Auto-shoot using computer's targeting logic
  const autoShoot = () => {
    if (!gameState.playerTurn || gameState.gameStatus !== 'playing') return;
    // Use AI logic to select next target on computer's board
    const [row, col] = computerMove(gameState.computerBoard);
    playerShoot(row, col);
  };

  // Toggle ship orientation during setup
  const toggleOrientation = () => {
    if (gameState.gameStatus !== 'setup') return;

    setGameState((prevState) => ({
      ...prevState,
      shipPlacementOrientation:
        prevState.shipPlacementOrientation === 'horizontal'
          ? 'vertical'
          : 'horizontal'
    }));
  };

  // Auto-place remaining ships
  const autoPlaceRemainingShips = () => {
    if (gameState.gameStatus !== 'setup') return;

    import('@models/battleship').then(
      ({ SHIP_SIZES, placeShip, canPlaceShip }) => {
        let updatedBoard = { ...gameState.playerBoard };
        const startId =
          gameState.selectedShipId !== null ? gameState.selectedShipId : 0;

        for (let i = startId; i < SHIP_SIZES.length; i++) {
          // Try up to 100 random positions to place the ship
          let placed = false;
          for (let attempt = 0; attempt < 100 && !placed; attempt++) {
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const row = Math.floor(Math.random() * updatedBoard.size);
            const col = Math.floor(Math.random() * updatedBoard.size);

            if (
              canPlaceShip(updatedBoard, SHIP_SIZES[i], row, col, orientation)
            ) {
              updatedBoard = placeShip(
                updatedBoard,
                i,
                SHIP_SIZES[i],
                row,
                col,
                orientation
              );
              placed = true;
            }
          }
        }

        setGameState((prevState) => ({
          ...prevState,
          playerBoard: updatedBoard,
          selectedShipId: null,
          gameStatus: 'playing'
        }));

        setMessage('Ships auto-placed! Game is starting. Take your shot!');
      }
    );
  };

  // Initialize computer board when game starts
  useEffect(() => {
    if (
      gameState.gameStatus === 'playing' &&
      gameState.computerBoard.ships.length === 0
    ) {
      import('@models/battleship').then(({ generateComputerBoard }) => {
        const computerBoard = generateComputerBoard();
        setGameState((prevState) => ({
          ...prevState,
          computerBoard
        }));
      });
    }
  }, [gameState.gameStatus]);

  // Initialize message on first load
  useEffect(() => {
    if (gameState.gameStatus === 'setup' && !message) {
      const shipId = gameState.selectedShipId;
      if (shipId !== null) {
        setMessage(`Place your ${getShipName(shipId)}.`);
      } else {
        setMessage('Welcome to Battleship! Place your ships on the board.');
      }
    }
  }, []);

  return {
    gameState,
    message,
    resetGame,
    placePlayerShip,
    playerShoot,
    toggleOrientation,
    autoPlaceRemainingShips,
    autoShoot
  };
};

// Helper function to get ship names
const getShipName = (shipId: number): string => {
  const shipNames = [
    'Carrier',
    'Battleship',
    'Cruiser',
    'Submarine',
    'Destroyer'
  ];
  return shipNames[shipId] || `Ship ${shipId}`;
};
