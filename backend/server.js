require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const providerRoutes = require('./routes/providerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Connect to Database
connectDB();

const app = express();

// Create HTTP server and bind Socket.io
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'https://mini-project-two-woad.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors({
  origin: 'https://mini-project-two-woad.vercel.app', // Allow all origins for dev simplicity, can narrow down in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dev Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve local uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the ServNexa API',
    status: 'Running',
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a booking room
  socket.on('join_room', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle typing status
  socket.on('typing', ({ roomId, userId, isTyping, userName }) => {
    socket.to(roomId).emit('typing_status', { userId, isTyping, userName });
  });

  // Handle message sending
  socket.on('send_message', async (data) => {
    try {
      const { roomId, sender, senderModel, recipient, recipientModel, text, fileUrl, fileName, fileType } = data;
      
      const Message = require('./models/Message');
      const newMessage = await Message.create({
        roomId,
        sender,
        senderModel,
        recipient,
        recipientModel,
        text,
        fileUrl,
        fileName,
        fileType,
      });

      // Populate sender before emitting
      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name profilePhoto');

      // Emit message to everyone in the room
      io.to(roomId).emit('receive_message', populatedMessage);

      // Trigger standard in-app notification to the recipient
      const Notification = require('./models/Notification');
      const senderName = populatedMessage.sender?.name || 'User';
      
      await Notification.create({
        recipient,
        recipientModel,
        title: `New Message from ${senderName}`,
        message: text || 'Sent an attachment',
      });

    } catch (err) {
      console.error('Socket send_message error:', err.message);
    }
  });

  // Handle read messages receipt
  socket.on('mark_read', async ({ roomId, userId }) => {
    try {
      const Message = require('./models/Message');
      await Message.updateMany(
        { roomId, sender: { $ne: userId }, read: false },
        { $set: { read: true, readAt: new Date() } }
      );
      
      // Notify other clients in the room to update read receipt UI
      io.to(roomId).emit('messages_read', { roomId, userId });
    } catch (err) {
      console.error('Socket mark_read error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
