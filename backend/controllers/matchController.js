import User from '../models/User.js';
import Match from '../models/Match.js';
import { findMatches, checkMutualConnection } from '../services/matchingService.js';

// @desc    Find potential matches
// @route   POST /api/match/find
// @access  Private
export const findPotentialMatches = async (req, res) => {
  try {
    const matches = await findMatches(req.user._id);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Connect with a user (like/swipe right)
// @route   POST /api/match/connect
// @access  Private
export const connectWithUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if already in pending connections
    if (currentUser.pendingConnections.includes(targetUserId)) {
      return res.status(400).json({ message: 'Connection already pending' });
    }

    // Add to pending connections
    currentUser.pendingConnections.push(targetUserId);
    await currentUser.save();

    // Check for mutual connection (if target user has already liked current user)
    const isMutual = await checkMutualConnection(currentUserId, targetUserId);

    if (isMutual) {
      // Create match
      const match = await Match.create({
        users: [currentUserId, targetUserId],
      });

      // Add match to both users
      currentUser.matches.push(match._id);
      targetUser.matches.push(match._id);

      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: 'It\'s a match!',
        status: 'matched',
        match: match,
        isMutual: true,
        matchedUser: {
          _id: targetUser._id,
          name: targetUser.name,
          role: targetUser.role,
          bio: targetUser.bio,
        },
      });
    }

    res.json({
      message: 'Connection request sent',
      status: 'pending',
      isMutual: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pass on a user (dislike/swipe left)
// @route   POST /api/match/pass
// @access  Private
export const passOnUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    // We just acknowledge the pass - could store in a "passed" array if needed
    // For now, just return success
    res.json({
      message: 'Passed',
      passed: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending connection requests (users who liked the current user)
// @route   GET /api/match/requests
// @access  Private
export const getPendingRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all users who have the current user in their pendingConnections
    // but current user hasn't liked them back yet
    const currentUser = await User.findById(currentUserId);
    
    const usersWhoLikedMe = await User.find({
      pendingConnections: currentUserId,
      _id: { $ne: currentUserId },
    }).select('-password');

    // Filter out users that current user has already matched with
    const matchedUserIds = currentUser.matches.map(m => m.toString());
    
    const pendingRequests = usersWhoLikedMe.filter(user => {
      // Check if not already matched
      const userMatchIds = user.matches.map(m => m.toString());
      const hasCommonMatch = matchedUserIds.some(id => userMatchIds.includes(id));
      return !hasCommonMatch;
    });

    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sent connection requests (users the current user has liked)
// @route   GET /api/match/sent
// @access  Private
export const getSentRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).populate({
      path: 'pendingConnections',
      select: '-password',
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out users that are already matched
    const matchedUserIds = currentUser.matches.map(m => m.toString());
    const sentRequests = currentUser.pendingConnections.filter(
      user => !matchedUserIds.includes(user._id.toString())
    );

    res.json(sentRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's matches
// @route   GET /api/match/my
// @access  Private
export const getMyMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'matches',
      populate: {
        path: 'users',
        select: '-password',
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the current user from each match and return the matched user
    const matches = user.matches.map(match => {
      const matchedUser = match.users.find(
        u => u._id.toString() !== req.user._id.toString()
      );
      return {
        matchId: match._id,
        chatId: match.chatId,
        user: matchedUser,
        createdAt: match.createdAt,
      };
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
