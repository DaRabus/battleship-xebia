import { Box, Paper, Typography } from '@mui/material';
import type { CellState } from '@models/battleship';

interface BattleHistoryProps {
  playerBoard: {
    grid: CellState[][];
  };
  computerBoard: {
    grid: CellState[][];
  };
}

export const BattleHistory: React.FC<BattleHistoryProps> = ({
  playerBoard,
  computerBoard
}) => {
  // Create a grid representation of hits and misses (5x5)
  // This is a simplified visualization to show shot patterns
  const generateShotGrid = (grid: CellState[][]) => {
    const size = grid.length;
    const shotGrid: ('hit' | 'miss' | null)[][] = Array(5)
      .fill(null)
      .map(() => Array(5).fill(null));

    // Sample the larger grid to create a 5x5 representation
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const sampleRow = Math.floor((i / 5) * size);
        const sampleCol = Math.floor((j / 5) * size);

        if (grid[sampleRow][sampleCol] === 'hit') {
          shotGrid[i][j] = 'hit';
        } else if (grid[sampleRow][sampleCol] === 'miss') {
          shotGrid[i][j] = 'miss';
        }
      }
    }

    return shotGrid;
  };

  const playerShotGrid = generateShotGrid(computerBoard.grid);
  const computerShotGrid = generateShotGrid(playerBoard.grid);

  return (
    <Box className="my-4">
      <Paper elevation={2} className="p-4">
        <Typography variant="h6" gutterBottom className="border-b pb-1">
          Battle History (Simplified View)
        </Typography>

        <Box className="flex flex-wrap justify-around mt-2">
          <Box className="w-full md:w-1/2 mb-3">
            <Typography
              variant="subtitle2"
              className="font-bold text-blue-700 mb-1"
            >
              Your Shots:
            </Typography>
            <Box className="grid grid-cols-5 gap-1 w-max mx-auto">
              {playerShotGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Box
                    key={`player-shot-${rowIndex}-${colIndex}`}
                    className="w-4 h-4 border border-gray-300"
                    sx={{
                      backgroundColor:
                        cell === 'hit'
                          ? '#e53935'
                          : cell === 'miss'
                            ? '#9e9e9e'
                            : '#e0e0e0'
                    }}
                  />
                ))
              )}
            </Box>
          </Box>

          <Box className="w-full md:w-1/2">
            <Typography
              variant="subtitle2"
              className="font-bold text-red-700 mb-1"
            >
              Enemy Shots:
            </Typography>
            <Box className="grid grid-cols-5 gap-1 w-max mx-auto">
              {computerShotGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Box
                    key={`computer-shot-${rowIndex}-${colIndex}`}
                    className="w-4 h-4 border border-gray-300"
                    sx={{
                      backgroundColor:
                        cell === 'hit'
                          ? '#e53935'
                          : cell === 'miss'
                            ? '#9e9e9e'
                            : '#e0e0e0'
                    }}
                  />
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
