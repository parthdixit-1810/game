const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Game data
const questionPool = [
  // Film Trivia Questions
  { id: 1, category: "film", question: "Which actor played Aamir in Lagaan?", options: ["Aamir Khan", "Shah Rukh Khan", "Akshay Kumar", "Salman Khan"], correct: 0 },
  { id: 2, category: "film", question: "Who directed 3 Idiots?", options: ["Rajkumar Hiranyi", "Rajkumar Hirani", "Amir Khan", "Sachin Tendulkar"], correct: 1 },
  { id: 3, category: "film", question: "Which film features the character 'Munna Bhai'?", options: ["Munna Bhai M.B.B.S.", "Lage Raho Munna Bhai", "Both", "Neither"], correct: 2 },
  { id: 4, category: "film", question: "Who played the lead role in 'Dilwale Dulhania Le Jayenge'?", options: ["Shah Rukh Khan", "Aamir Khan", "Salman Khan", "Saif Ali Khan"], correct: 0 },
  { id: 5, category: "film", question: "Which actress debuted in 'Maine Pyar Kiya'?", options: ["Madhuri Dixit", "Juhi Chawla", "Bhagyashree", "Sridevi"], correct: 2 },
  { id: 6, category: "film", question: "Who is known as the 'King of Bollywood'?", options: ["Aamir Khan", "Shah Rukh Khan", "Salman Khan", "Akshay Kumar"], correct: 1 },
  { id: 7, category: "film", question: "Which film won the Oscar for Best Foreign Language Film?", options: ["Lagaan", "Mother India", "Salaam Bombay", "Gandhi"], correct: 0 },
  { id: 8, category: "film", question: "Who played the role of 'Raj' in Dilwale Dulhania Le Jayenge?", options: ["Shah Rukh Khan", "Aamir Khan", "Salman Khan", "Saif Ali Khan"], correct: 0 },
  { id: 9, category: "film", question: "Which actress is known as the 'Queen of Bollywood'?", options: ["Madhuri Dixit", "Sridevi", "Juhi Chawla", "Kajol"], correct: 1 },
  { id: 10, category: "film", question: "Who directed the film 'Dhoom'?", options: ["Sanjay Gadhvi", "Vijay Kumar", "Mahesh Bhatt", "Karan Johar"], correct: 0 },
  { id: 11, category: "film", question: "Which film features the song 'Mere Haath Mein'?", options: ["Dilwale Dulhania Le Jayenge", "Kuch Kuch Hota Hai", "Mohabbatein", "Kabhi Khushi Kabhi Gham"], correct: 1 },
  { id: 12, category: "film", question: "Who played the role of 'Chulbul Pandey' in Dabangg?", options: ["Salman Khan", "Akshay Kumar", "Ajay Devgan", "Sunil Shetty"], correct: 0 },
  { id: 13, category: "film", question: "Which film is a remake of 'The Italian Job'?", options: ["Dhoom", "Dhoom 2", "Race", "Players"], correct: 1 },
  { id: 14, category: "film", question: "Who is known as the 'Angry Young Man' of Bollywood?", options: ["Salman Khan", "Akshay Kumar", "Ajay Devgan", "Sunil Shetty"], correct: 1 },
  { id: 15, category: "film", question: "Which film features the character 'Bajrangi Bhaijaan'?", options: ["Bajrangi Bhaijaan", "Ready", "Dabangg 2", "Ek Tha Tiger"], correct: 0 },
  // Song Lyrics Questions
  { id: 101, category: "lyrics", question: "Complete: 'Ek din bik jayega...'", options: ["Mati ke mol", "Dharti ke mol", "Mitti ke mol", "Dharti ke mol"], correct: 2 },
  { id: 102, category: "lyrics", question: "Complete: 'Mere paas maa hai...'", options: ["Tere paas kya hai?", "Kya hai tere paas?", "Tumhare paas kya hai?", "Kya hai tumhare paas?"], correct: 0 },
  { id: 103, category: "lyrics", question: "Complete: 'Koel si boli...'", options: ["Sakhi ri", "Sakhi re", "Sakhi riya", "Sakhi"], correct: 0 },
  { id: 104, category: "lyrics", question: "Complete: 'Tujhe dekha toh...'", options: ["Yeh jaana sanam", "Yeh jana sanam", "Yeh jaana sanam", "Yeh jana sanam"], correct: 0 },
  { id: 105, category: "lyrics", question: "Complete: 'Tum mujhe...'", options: ["Bhula do", "Bhulado", "Bhool do", "Bhule do"], correct: 0 },
  { id: 106, category: "lyrics", question: "Complete: 'Kal ho na ho...'", options: ["Har din yun hi", "Har din yahi", "Har din vohi", "Har din tumhi"], correct: 0 },
  { id: 107, category: "lyrics", question: "Complete: 'Tum paas aate...'", options: ["Hue khubsurat", "Hue khoobsurat", "Hue sunder", "Hue badhiyaan"], correct: 1 },
  { id: 108, category: "lyrics", question: "Complete: 'Mera joota hai...'", options: ["Japani", "Chini", "Russian", "German"], correct: 0 },
  { id: 109, category: "lyrics", question: "Complete: 'Chura liya hai...'", options: ["Tumne", "Aapne", "Usne", "Sabne"], correct: 0 },
  { id: 110, category: "lyrics", question: "Complete: 'Ghar se nikalte hi...'", options: ["Kuch door", "Kuch dur", "Kuch door", "Kuch dur"], correct: 0 }
];

const darePool = [
  "Do your best SRK pose and hold it for 10 seconds",
  "Sing a Bollywood song chosen by the winner",
  "Talk in a movie dialogue style for the next 2 minutes",
  "Dance like a Bollywood hero for 30 seconds",
  "Impersonate a famous Bollywood actor",
  "Recite a famous Bollywood dialogue with emotion",
  "Do the 'palat' step like in Bollywood movies",
  "Create a short Bollywood story with 3 random words",
  "Act out a movie title without speaking",
  "Do a romantic Bollywood dance move",
  "Sing a sad Bollywood song with feeling",
  "Do an action hero pose for 15 seconds",
  "Speak in a thick Bollywood accent for 1 minute",
  "Do the classic 'running in slow motion' Bollywood scene",
  "Create your own Bollywood movie tagline",
  "Act out a Bollywood villain laugh",
  "Do a romantic Bollywood hand gesture",
  "Sing a duet with yourself (both parts)",
  "Do a dramatic Bollywood crying scene",
  "Create a Bollywood dance with household items",
  "Speak Bollywood movie titles for 30 seconds",
  "Do the 'rain dance' Bollywood move",
  "Act like you just won a Filmfare award",
  "Do a Bollywood entry scene",
  "Speak in movie trailer voice style",
  "Do a Bollywood comedy routine",
  "Act out a Bollywood confrontation scene",
  "Do the 'looking at moon' romantic pose",
  "Create your own Bollywood dialogue",
  "Do a Bollywood dance with eyes closed"
];

// Room management
const rooms = new Map();

function generateRoomCode() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

function getRandomQuestion(usedQuestions) {
  const available = questionPool.filter(q => !usedQuestions.has(q.id));
  if (available.length === 0) {
    usedQuestions.clear();
    return questionPool[Math.floor(Math.random() * questionPool.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

function getRandomDare(usedDares) {
  const available = darePool.filter((dare, index) => !usedDares.has(index));
  if (available.length === 0) {
    usedDares.clear();
    const randomIndex = Math.floor(Math.random() * darePool.length);
    usedDares.add(randomIndex);
    return { text: darePool[randomIndex], index: randomIndex };
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  const dareIndex = darePool.indexOf(available[randomIndex]);
  usedDares.add(dareIndex);
  return { text: darePool[dareIndex], index: dareIndex };
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create room
  socket.on('createRoom', (playerName, callback) => {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      players: new Map(),
      host: socket.id,
      gameState: {
        status: 'waiting',
        currentQuestion: null,
        usedQuestions: new Set(),
        usedDares: new Set(),
        p1Answer: null,
        p2Answer: null,
        p1AnswerTime: null,
        p2AnswerTime: null,
        p1Score: 0,
        p2Score: 0,
        p1Rounds: 0,
        p2Rounds: 0,
        currentRound: 1,
        timer: null,
        timeLeft: 15
      }
    };

    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      playerNumber: 1,
      isHost: true
    });

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    callback({ success: true, roomCode });
    console.log(`Room created: ${roomCode} by ${playerName}`);
  });

  // Join room
  socket.on('joinRoom', ({ roomCode, playerName }, callback) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    if (room.players.size >= 2) {
      callback({ success: false, error: 'Room is full' });
      return;
    }

    const playerNumber = room.players.size + 1;
    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      playerNumber: playerNumber,
      isHost: false
    });

    socket.join(roomCode);
    socket.roomCode = roomCode;

    // Notify all players in room
    const players = Array.from(room.players.values());
    io.to(roomCode).emit('playersUpdate', players);

    callback({ success: true, players });
    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Start game
  socket.on('startGame', () => {
    const room = rooms.get(socket.roomCode);
    if (!room || socket.id !== room.host) return;

    room.gameState.status = 'playing';
    loadNextQuestion(room);
    io.to(socket.roomCode).emit('gameStarted', { gameState: getPublicGameState(room) });
  });

  // Submit answer
  socket.on('submitAnswer', (answerIndex) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.gameState.status !== 'playing') return;

    const player = room.players.get(socket.id);
    const now = Date.now();

    if (player.playerNumber === 1) {
      room.gameState.p1Answer = answerIndex;
      room.gameState.p1AnswerTime = now;
    } else {
      room.gameState.p2Answer = answerIndex;
      room.gameState.p2AnswerTime = now;
    }

    // Check if both players have answered or timer expired
    if (room.gameState.p1Answer !== null && room.gameState.p2Answer !== null) {
      resolveQuestion(room);
    }

    io.to(socket.roomCode).emit('gameStateUpdate', { gameState: getPublicGameState(room) });
  });

  // Player ready for next question
  socket.on('playerReady', () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (player.playerNumber === 1) {
      room.gameState.p1Ready = true;
    } else {
      room.gameState.p2Ready = true;
    }

    if (room.gameState.p1Ready && room.gameState.p2Ready) {
      room.gameState.p1Ready = false;
      room.gameState.p2Ready = false;
      
      if (room.gameState.p1Score >= 7 || room.gameState.p2Score >= 7) {
        endRound(room);
      } else {
        loadNextQuestion(room);
      }
    }

    io.to(socket.roomCode).emit('gameStateUpdate', { gameState: getPublicGameState(room) });
  });

  // Next round
  socket.on('nextRound', () => {
    const room = rooms.get(socket.roomCode);
    if (!room || socket.id !== room.host) return;

    room.gameState.p1Score = 0;
    room.gameState.p2Score = 0;
    room.gameState.currentRound++;
    room.gameState.usedQuestions.clear();
    room.gameState.usedDares.clear();
    room.gameState.status = 'playing';

    loadNextQuestion(room);
    io.to(socket.roomCode).emit('nextRound', { gameState: getPublicGameState(room) });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        room.players.delete(socket.id);
        
        if (room.players.size === 0) {
          rooms.delete(socket.roomCode);
          console.log(`Room deleted: ${socket.roomCode}`);
        } else {
          const players = Array.from(room.players.values());
          io.to(socket.roomCode).emit('playersUpdate', players);
        }
      }
    }
  });
});

function loadNextQuestion(room) {
  const question = getRandomQuestion(room.gameState.usedQuestions);
  room.gameState.currentQuestion = question;
  room.gameState.usedQuestions.add(question.id);
  room.gameState.p1Answer = null;
  room.gameState.p2Answer = null;
  room.gameState.p1AnswerTime = null;
  room.gameState.p2AnswerTime = null;
  room.gameState.timeLeft = 15;
  room.gameState.questionAnswered = false;

  // Start timer
  if (room.gameState.timer) {
    clearInterval(room.gameState.timer);
  }

  room.gameState.timer = setInterval(() => {
    room.gameState.timeLeft--;
    io.to(room.code).emit('timerUpdate', { timeLeft: room.gameState.timeLeft });

    if (room.gameState.timeLeft <= 0) {
      clearInterval(room.gameState.timer);
      resolveQuestion(room);
    }
  }, 1000);

  io.to(room.code).emit('questionLoaded', { 
    question: room.gameState.currentQuestion,
    timeLeft: room.gameState.timeLeft 
  });
}

function resolveQuestion(room) {
  if (room.gameState.questionAnswered) return;
  
  clearInterval(room.gameState.timer);
  room.gameState.questionAnswered = true;

  const question = room.gameState.currentQuestion;
  const p1Correct = room.gameState.p1Answer === question.correct;
  const p2Correct = room.gameState.p2Answer === question.correct;
  let scorerName = '';

  // Determine winner
  if (p1Correct && p2Correct) {
    // Both correct - who was faster?
    if (room.gameState.p1AnswerTime < room.gameState.p2AnswerTime) {
      room.gameState.p1Score++;
      scorerName = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 1)).name;
    } else {
      room.gameState.p2Score++;
      scorerName = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 2)).name;
    }
  } else if (p1Correct) {
    room.gameState.p1Score++;
    scorerName = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 1)).name;
  } else if (p2Correct) {
    room.gameState.p2Score++;
    scorerName = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 2)).name;
  }

  const result = {
    p1Answer: room.gameState.p1Answer,
    p2Answer: room.gameState.p2Answer,
    correctIndex: question.correct,
    p1Score: room.gameState.p1Score,
    p2Score: room.gameState.p2Score,
    scorerName: scorerName
  };

  io.to(room.code).emit('questionResult', result);
}

function endRound(room) {
  let loser, dare;
  if (room.gameState.p1Score >= 7) {
    loser = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 2)).name;
    room.gameState.p1Rounds++;
  } else {
    loser = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 1)).name;
    room.gameState.p2Rounds++;
  }

  dare = getRandomDare(room.gameState.usedDares);
  const winner = room.gameState.p1Score >= 7 ? 
    room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 1)).name :
    room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 2)).name;

  const roundResult = {
    winner: winner,
    loser: loser,
    dare: dare.text,
    dareIndex: dare.index,
    p1Rounds: room.gameState.p1Rounds,
    p2Rounds: room.gameState.p2Rounds
  };

  room.gameState.status = 'roundEnd';
  io.to(room.code).emit('roundEnd', roundResult);
}

function getPublicGameState(room) {
  return {
    status: room.gameState.status,
    currentQuestion: room.gameState.currentQuestion,
    p1Score: room.gameState.p1Score,
    p2Score: room.gameState.p2Score,
    p1Rounds: room.gameState.p1Rounds,
    p2Rounds: room.gameState.p2Rounds,
    currentRound: room.gameState.currentRound,
    timeLeft: room.gameState.timeLeft,
    questionAnswered: room.gameState.questionAnswered
  };
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
