import Message from '../models/Message.js';
import Match from '../models/Match.js';

// @desc    Get messages for a chat
// @route   GET /api/chat/:matchId
// @access  Private
export const getChatMessages = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Verify user is part of this match
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (!match.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    // Get messages
    const messages = await Message.find({ chatId: match.chatId })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat/:matchId
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { text } = req.body;

    // Verify user is part of this match
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (!match.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to send messages to this chat' });
    }

    // Create message
    const message = await Message.create({
      chatId: match.chatId,
      senderId: req.user._id,
      text,
    });

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
