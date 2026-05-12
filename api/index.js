const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

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
   "Remove your shirt entirely and don't put it back on for the rest of the game",
    "Unzip your pants or skirt and let them drop to your ankles while staying on camera",
    "Show me the tan lines on your hips by pulling your underwear down just an inch",
    "Take off your underwear without taking off your pants or skirt",
    "Show me your bare chest or cleavage for exactly 5 seconds, then go dark",
    "Lift your shirt and show me the skin of your stomach and ribs while breathing heavily",
    "Turn around and show me the curve of your bare backside",
    "Slide your hand inside your underwear and show me the movement of your hand",
    "Take off one item of clothing using only your teeth",
    "Show me your 'happy trail' or the base of your stomach and v-line",
    "Stand up and show me your bare thighs from the back",
    "Unbutton your pants and show me the lace or fabric of your underwear",
    "Remove your bra or undershirt while keeping your outer shirt on",
    "Show me the side-profile of your body while completely naked from the waist up",
    "Pull your underwear to the side to show me a 'peek' of what’s underneath",
    "Show me your bare hips and the dimples on your lower back",
    "Slowly slide your pants off while keeping eye contact with the camera",
    "Show me your bare chest while you trace your nipples with your fingers",
    "Take off everything except your underwear and do a slow 360-degree turn",
    "Show me where you are 'ready' by pressing the fabric of your underwear against yourself",
    "Remove your shirt and use it to blindfold yourself for the next three dares",
    "Show me the skin of your inner thigh, as high up as you can go",
    "Undo every button on your shirt but don't take it off; let it hang open",
    "Show me your bare chest or breasts reflected in a mirror",
    "Put on your tightest piece of clothing and then take it off as slowly as possible",
    "Trace your own body from your neck down to your genitals over your clothes",
    "Pinch your nipples until they are hard and show them to me",
    "Spank yourself hard enough to leave a red mark and show me the mark",
    "Lick your own finger and trace it around your nipple or sensitive area",
    "Show me how you look when you’re 'pleasuring' yourself without showing the act",
    "Put a piece of ice down your shirt and show me your reaction",
    "Bite your inner thigh and show me the tooth marks",
    "Show me your 'O-face' while you touch yourself through your clothes",
    "Pour a small amount of water on your chest and show me how it drips down",
    "Grab yourself firmly and groan into the microphone",
    "Describe the last time you were completely naked in front of someone",
    "What is the most extreme sexual thing you’ve ever let someone do to you?",
    "Tell me about a time you had sex in a place where you could have been caught",
    "What is the biggest toy you’ve ever used on yourself?",
    "Have you ever had a threesome? Describe the best part",
    "What is the dirtiest thing a partner has ever said to you in bed?",
    "Describe your favorite one-night stand experience",
    "Have you ever watched yourself having sex in a mirror? Describe it",
    "Tell me about the time you were the most turned on you’ve ever been",
    "What is a fetish you’ve acted on in the past?",
    "Have you ever been tied up or restrained? Tell me everything",
    "What is the most scandalous photo you’ve ever sent someone?",
    "Tell me about a time you performed for someone else",
    "What is the longest you’ve ever spent on foreplay alone?",
    "Describe the most primal or animalistic sex you’ve ever had",
    "Tell me exactly where you want me to bite you until you bruise",
    "If I were there, which item of clothing would you want me to rip off first?",
    "Describe exactly how you want me to taste you for the first time",
    "What is the most dominant thing you want to do to me?",
    "Describe a fantasy involving you, me, and a public bathroom",
    "Tell me what you want to feel dripping down your legs",
    "If we were in a movie, describe our 'uncut' sex scene",
    "What is the first thing you want to feel inside of you when we meet?",
    "Tell me how you want me to 'punish' you for being a tease tonight",
    "Describe the mess we would make in a hotel room",
    "Send a photo of your bare chest with my name written on your skin",
    "Show me the view of your body from between your legs",
    "Take a video of you unzipping your pants and dropping them",
    "Show me your bare skin while you are in the shower or bath",
    "Put your hand down your pants and tell me exactly how it feels in there",
    "Show me your naughtiest piece of clothing on your bare body",
    "Describe the scent of your arousal right now",
    "Show me your bare stomach while you contract your muscles",
    "Take off your shirt and show me your back and spine",
    "Show me your wet underwear",
    "Describe the exact way you’re going to finish yourself off later",
    "Show me the underside of your breasts or pecs",
    "Pull your pants down just enough to show me your pubic hair or shaven area",
    "Show me your reaction when I say something filthy",
    "Hold the camera close to your mouth and describe an oral fantasy",
    "Show me your bare neck while you pretend I’m holding you",
    "Tell me about a time you had sex while someone else was in the house",
    "What is the most taboo thing you think about when you're alone?",
    "Describe the feeling of being stretched or filled",
    "Show me your bare waist and hips from the back",
    "Tell me about a time you were edged for a long time",
    "Show me your bare feet while you curl your toes",
    "Describe your favorite kink that most people think is weird",
    "Show me your 'morning' body as if we just woke up",
    "Tell me about a time you had sex in a risky outdoor location",
    "Show me the gap between your thighs",
    "Describe the tastiest thing you’ve ever done sexually",
    "Show me your 'O-face' and hold it for 10 seconds",
    "Tell me how you want to be used by me",
    "Show me your bare collarbone while you bite your lip",
    "Describe the most intense orgasm you’ve ever had in your life",
    "Show me your body in the 'doggy' position",
    "Tell me what you want to do to me in a crowded theater",
    "Show me your 'spreading' of your legs or chest",
    "Describe the weight of me on top of you",
    "Show me your sweaty skin after 'exercise'",
    "Tell me about a time you were watched without your knowledge",
    "Show me your bare hips while you thrust at the camera",
    "Describe the sound of your name being moaned",
    "Take off everything, turn the camera off, and tell me what you’re doing to yourself"
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

    callback({ success: true, roomCode: roomCode });
    io.to(roomCode).emit('playersUpdate', Array.from(room.players.values()));
  });

  // Join room
  socket.on('joinRoom', (data, callback) => {
    const { roomCode, playerName } = data;
    const room = rooms.get(roomCode);

    if (!room) {
      callback({ success: false, message: 'Room not found' });
      return;
    }

    if (room.players.size >= 2) {
      callback({ success: false, message: 'Room is full' });
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

    callback({ success: true, roomCode: roomCode });
    io.to(roomCode).emit('playersUpdate', Array.from(room.players.values()));
  });

  // Start game
  socket.on('startGame', () => {
    const room = rooms.get(socket.roomCode);
    if (!room || socket.id !== room.host) return;

    room.gameState.status = 'playing';
    io.to(socket.roomCode).emit('gameStarted');
    loadNextQuestion(room);
  });

  // Submit answer
  socket.on('submitAnswer', (answerIndex) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.gameState.status !== 'playing') return;

    const player = room.players.get(socket.id);
    const answerTime = Date.now();

    if (player.playerNumber === 1) {
      room.gameState.p1Answer = answerIndex;
      room.gameState.p1AnswerTime = answerTime;
    } else {
      room.gameState.p2Answer = answerIndex;
      room.gameState.p2AnswerTime = answerTime;
    }

    if (room.gameState.p1Answer !== null && room.gameState.p2Answer !== null) {
      resolveQuestion(room);
    }
  });

  // Player ready for next question
  socket.on('playerReady', () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;

    if (socket.id === room.host) {
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
    
    const room = rooms.get(socket.roomCode);
    if (room) {
      room.players.delete(socket.id);
      io.to(socket.roomCode).emit('playersUpdate', Array.from(room.players.values()));
      
      if (room.players.size === 0) {
        rooms.delete(socket.roomCode);
      }
    }
  });
});

function loadNextQuestion(room) {
  const question = getRandomQuestion(room.gameState.usedQuestions);
  room.gameState.currentQuestion = question;
  room.gameState.p1Answer = null;
  room.gameState.p2Answer = null;
  room.gameState.p1AnswerTime = null;
  room.gameState.p2AnswerTime = null;
  room.gameState.questionAnswered = false;
  room.gameState.timeLeft = 15;

  io.to(room.code).emit('questionLoaded', {
    question: question,
    timeLeft: 15
  });

  startTimer(room);
}

function startTimer(room) {
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
}

function resolveQuestion(room) {
  if (room.gameState.timer) {
    clearInterval(room.gameState.timer);
  }

  const question = room.gameState.currentQuestion;
  const p1Player = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 1));
  const p2Player = room.players.get(Array.from(room.players.keys()).find(id => room.players.get(id).playerNumber === 2));

  const p1Correct = room.gameState.p1Answer === question.correct;
  const p2Correct = room.gameState.p2Answer === question.correct;

  if (p1Correct) {
    room.gameState.p1Score++;
  }
  if (p2Correct) {
    room.gameState.p2Score++;
  }

  const result = {
    p1Answer: room.gameState.p1Answer,
    p2Answer: room.gameState.p2Answer,
    p1Correct: p1Correct,
    p2Correct: p2Correct,
    correctAnswer: question.correct,
    p1Score: room.gameState.p1Score,
    p2Score: room.gameState.p2Score,
    p1AnswerTime: room.gameState.p1AnswerTime,
    p2AnswerTime: room.gameState.p2AnswerTime
  };

  room.gameState.questionAnswered = true;
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

module.exports = (req, res) => {
  app(req, res);
};
