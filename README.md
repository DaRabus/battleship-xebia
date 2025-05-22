# Battleship Game

A modern implementation of the classic Battleship game built with Next.js, TypeScript, and Material UI.  
Developed with GitHub Copilot Agent for the Xebia Event on May 22, 2025.

![Battleship Game](public/profile.jpg)

## Technology Stack

- **Framework**: Next.js 15.x
- **Language**: TypeScript
- **UI Libraries**: Material UI v6, Tailwind CSS
- **State Management**: React Hooks & usehooks-ts (localStorage)
- **AI & Animations**: Smart targeting computer AI, React Confetti for win celebration

## Features

- Classic Battleship gameplay
- Responsive design that works on desktop and mobile
- State persistence using localStorage
- Smart computer opponent
- Ship placement with rotation and auto-placement options
- Real-time game status updates
- Animated hit indicators (GitHub icon)

## Game Guide

### Getting Started

1. When you first load the game, you'll be in ship placement mode
2. You'll place your ships one by one on your board (left side)
3. The first ship to place is the Carrier (5 spaces)
4. Click on the grid to place your ship
5. Use the "Rotate Ship" button to change ship orientation
6. Use "Auto-Place All" to automatically place all remaining ships

### Ship Fleet

- **Carrier**: 5 spaces
- **Battleship**: 4 spaces
- **Cruiser**: 3 spaces
- **Submarine**: 3 spaces
- **Destroyer**: 2 spaces

### Gameplay

1. After placing all ships, the game starts with your turn
2. Click on the opponent's board (right side) to fire a shot
3. Blue cells on your board represent your ships
4. Gray dots represent missed shots
5. GitHub icons represent hits
6. After you shoot, the computer will automatically take its turn
7. The game ends when either you or the computer sinks all opponent's ships

### Controls

- **Rotate Ship**: Changes the ship orientation during placement (horizontal/vertical)
- **Auto-Place All**: Automatically places all your remaining ships
- **Restart Game**: Resets the game progress completely by clearing localStorage
- **Start New Game**: Appears after the game ends to start a new game without clearing localStorage

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/battleship-xebia.git
cd battleship-xebia

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

## State Persistence

The game state is stored in your browser's localStorage, allowing you to:
- Continue your game even if you close the browser
- Maintain your progress between sessions
- Use the "Restart" button to clear the localStorage and start fresh

## Deployment

This project is set up to automatically deploy to GitHub Pages when changes are pushed to the main branch. The live version can be accessed at: 
- https://darabus.github.io/battleship-xebia/

### Manual Deployment

You can also manually trigger the deployment from the GitHub Actions tab in your repository.

```bash
# Build locally for deployment 
npm run build
# The static files will be in the 'out' directory
```

## Future Enhancements

- Multiplayer support
- Difficulty levels for computer AI
- Sound effects and music
- Leaderboards and statistics
- Custom themes

## License

MIT

---
*Code generated in part by GitHub Copilot Agent for the Xebia Event on May 22, 2025.*
