// backend/src/controllers/chat.js

const Chat = require('../models/Chat');
const Connection = require('../models/Connection');

/**
 * Get (or create) chat thread for a connection
 * Assumes auth middleware has set req.user
 */
exports.getOrCreateChat = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId)
      .populate('from to', 'name email');

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Only participants can access
    const isParticipant =
      connection.from.toString() === req.user._id.toString() ||
      connection.to.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized for this chat' });
    }

    let chat = await Chat.findOne({ connectionId })
      .populate('messages.sender', 'name email');

    if (!chat) {
      chat = new Chat({
        connectionId,
        roomId: connection.roomId || `room_${connectionId}`,
        participants: [connection.from, connection.to],
        messages: []
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error('getOrCreateChat error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Add a new message to chat (REST fallback; real‑time emit is done via Socket.io)
 */
exports.postMessage = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    const isParticipant =
      connection.from.toString() === req.user._id.toString() ||
      connection.to.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    let chat = await Chat.findOne({ connectionId });
    if (!chat) {
      chat = new Chat({
        connectionId,
        roomId: connection.roomId || `room_${connectionId}`,
        participants: [connection.from, connection.to],
        messages: []
      });
    }

    const message = {
      sender: req.user._id,
      content: content.trim()
    };

    chat.messages.push(message);
    await chat.save();

    const populated = await chat
      .populate('messages.sender', 'name email')
      .execPopulate?.() || chat;

    res.status(201).json(populated);
  } catch (err) {
    console.error('postMessage error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Helper to wire Socket.io in server.js
 * Example usage in server.js:
 *   const { registerChatHandlers } = require('./controllers/chat');
 *   io.on('connection', socket => registerChatHandlers(io, socket));
 */
exports.registerChatHandlers = (io, socket) => {
  // Join a chat room
  socket.on('chat:join', ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
  });

  // Receive and broadcast chat messages
  socket.on('chat:message', async ({ roomId, connectionId, senderId, content }) => {
    try {
      if (!roomId || !connectionId || !senderId || !content
