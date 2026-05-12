# Bollywood Buzz - Multiplayer Trivia Game

A real-time multiplayer Bollywood trivia game built with Node.js, Express, and Socket.IO.

## Features

- **Real-time multiplayer**: Play with friends in real-time
- **Room system**: Create or join rooms with 4-digit codes
- **Bollywood trivia**: Film and song lyric questions
- **Scoring system**: First to 7 points wins a round, first to 3 rounds wins the game
- **Dare challenges**: Losers perform fun Bollywood dares
- **Responsive design**: Works on desktop and mobile
- **Reconnection handling**: Automatic reconnection if disconnected

## Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Real-time communication**: Socket.IO
- **Deployment**: Ready for Render/Railway

## Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bollywood-buzz
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Game Rules

1. **Create or Join**: Create a room as host or join with a 4-digit code
2. **Answer Questions**: Answer Bollywood trivia questions as fast as you can
3. **Score Points**: First to 7 points wins the round
4. **Win the Game**: First to win 3 rounds becomes the champion
5. **Dare Challenges**: Round losers perform fun Bollywood dares

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

### Manual Deployment to Vercel

1. Push your code to GitHub
2. Connect your Vercel account to GitHub
3. Import the repository
4. Vercel will automatically detect the Node.js app and deploy

### Environment Variables for Vercel

- `NODE_ENV`: Automatically set to `production` by Vercel
- `PORT`: Vercel automatically sets this (don't override)

### Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the build command: `npm install`
5. Set the start command: `npm start`
6. Deploy!

### Railway

1. Push your code to GitHub
2. Create a new project on Railway
3. Add your repository
4. Railway will automatically detect the Node.js app
5. Deploy!

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Project Structure

```
bollywood-buzz/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── public/                # Static files
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Styles
│   └── game.js           # Client-side JavaScript
├── .gitignore            # Git ignore file
└── README.md             # This file
```

## API Events

### Client to Server

- `createRoom`: Create a new game room
- `joinRoom`: Join an existing room
- `startGame`: Start the game (host only)
- `submitAnswer`: Submit an answer to current question
- `playerReady`: Indicate readiness for next question
- `nextRound`: Start next round (host only)
- `leaveRoom`: Leave current room

### Server to Client

- `playersUpdate`: Update players list
- `gameStarted`: Game has started
- `questionLoaded`: New question loaded
- `timerUpdate`: Timer countdown update
- `questionResult`: Results of current question
- `gameStateUpdate`: General game state update
- `roundEnd`: Round has ended
- `nextRound`: Next round starting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.
