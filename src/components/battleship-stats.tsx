import { Box, Paper, Typography } from '@mui/material';
import type { CellState } from '@models/battleship';

interface BattleshipStatsProps {
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
}

export const BattleshipStats: React.FC<BattleshipStatsProps> = ({
  playerBoard,
  computerBoard
}) => {
  // Count hits and misses for player shots (on computer board)
  const playerHits = computerBoard.grid
    .flat()
    .filter((cell) => cell === 'hit').length;
  const playerMisses = computerBoard.grid
    .flat()
    .filter((cell) => cell === 'miss').length;
  const playerShots = playerHits + playerMisses;
  const playerAccuracy =
    playerShots > 0 ? ((playerHits / playerShots) * 100).toFixed(1) : '0';

  // Count hits and misses for computer shots (on player board)
  const computerHits = playerBoard.grid
    .flat()
    .filter((cell) => cell === 'hit').length;
  const computerMisses = playerBoard.grid
    .flat()
    .filter((cell) => cell === 'miss').length;
  const computerShots = computerHits + computerMisses;
  const computerAccuracy =
    computerShots > 0 ? ((computerHits / computerShots) * 100).toFixed(1) : '0';

  // Calculate ships destroyed
  const playerShipsDestroyed = computerBoard.ships.filter(
    (ship) => ship.hits === ship.size
  ).length;
  const computerShipsDestroyed = playerBoard.ships.filter(
    (ship) => ship.hits === ship.size
  ).length;
  const totalShips = playerBoard.ships.length;

  return (
    <Box className="my-4">
      <Paper elevation={2} className="p-4">
        <Typography variant="h6" gutterBottom className="border-b pb-1">
          Battle Statistics
        </Typography>

        <Box className="flex flex-wrap justify-around mt-2">
          <Box className="w-full md:w-1/2 mb-3">
            <Typography variant="subtitle1" className="font-bold text-blue-700">
              Your Stats:
            </Typography>
            <Box className="pl-3">
              <Typography>Shots Fired: {playerShots}</Typography>
              <Typography>
                Hits:{' '}
                <span className="text-red-600 font-bold">{playerHits}</span>
              </Typography>
              <Typography>Misses: {playerMisses}</Typography>
              <Typography>Accuracy: {playerAccuracy}%</Typography>
              <Typography>
                Enemy Ships Destroyed:{' '}
                <span className="text-red-600 font-bold">
                  {playerShipsDestroyed}/{totalShips}
                </span>
              </Typography>
            </Box>
          </Box>

          <Box className="w-full md:w-1/2">
            <Typography variant="subtitle1" className="font-bold text-red-700">
              Enemy Stats:
            </Typography>
            <Box className="pl-3">
              <Typography>Shots Fired: {computerShots}</Typography>
              <Typography>
                Hits:{' '}
                <span className="text-red-600 font-bold">{computerHits}</span>
              </Typography>
              <Typography>Misses: {computerMisses}</Typography>
              <Typography>Accuracy: {computerAccuracy}%</Typography>
              <Typography>
                Your Ships Destroyed:{' '}
                <span className="text-red-600 font-bold">
                  {computerShipsDestroyed}/{totalShips}
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
