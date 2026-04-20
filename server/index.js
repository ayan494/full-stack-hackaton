const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('  Body:', JSON.stringify(req.body).slice(0, 200));
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Helplytics AI API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Socket.io Logic
const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, message } = data;
    try {
      const newMessage = await Message.create({ sender, receiver, message });
      io.to(receiver).emit('receiveMessage', newMessage);
      io.to(sender).emit('receiveMessage', newMessage); // Sync for sender
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server — connect to DB first, then listen
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
