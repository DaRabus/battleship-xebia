'use client';
import { useBattleshipGame } from '@hooks/useBattleshipGame';
import { Container, Typography, Box, Paper } from '@mui/material';
import { BattleshipGame } from "@components/BattleshipGame";

export default function Home() {
  const {
    gameState,
    message,
    resetGame,
    placePlayerShip,
    playerShoot,
    toggleOrientation,
    autoPlaceRemainingShips,
    autoShoot
  } = useBattleshipGame();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Battleship Game vs. Bot
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          A classic naval combat game where you strategically place your fleet and attempt to sink the enemy's ships.
        </Typography>
      </Paper>

      <BattleshipGame
        gameState={gameState}
        message={message}
        onPlaceShip={placePlayerShip}
        onShoot={playerShoot}
        onResetGame={resetGame}
        onToggleOrientation={toggleOrientation}
        onAutoPlace={autoPlaceRemainingShips}
        onAutoShoot={autoShoot}
      />
    </Container>
  );
}
