import User from '../models/User.js';
import Match from '../models/Match.js';

// Helper function to check if profile is complete
const checkProfileComplete = (user) => {
  return !!(
    user.name &&
    user.role &&
    user.skills.length > 0 &&
    user.seekingRoles && user.seekingRoles.length > 0
  );
};

// @desc    Update user profile (all fields)
// @route   POST /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.role = req.body.role || user.role;
      user.skills = req.body.skills || user.skills;
      user.lookingFor = req.body.lookingFor || user.lookingFor;
      user.seekingRoles = req.body.seekingRoles || user.seekingRoles;
      user.seekingSkills = req.body.seekingSkills || user.seekingSkills;
      user.location = req.body.location || user.location;
      user.availability = req.body.availability || user.availability;
      user.hackathons = req.body.hackathons ?? user.hackathons;
      user.wins = req.body.wins ?? user.wins;
      
      // Mark profile as completed if explicitly set or check required fields
      if (req.body.profileCompleted !== undefined) {
        user.profileCompleted = req.body.profileCompleted;
      } else {
        user.profileCompleted = checkProfileComplete(user);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        lookingFor: updatedUser.lookingFor,
        seekingRoles: updatedUser.seekingRoles,
        seekingSkills: updatedUser.seekingSkills,
        location: updatedUser.location,
        availability: updatedUser.availability,
        hackathons: updatedUser.hackathons,
        wins: updatedUser.wins,
        profileCompleted: updatedUser.profileCompleted,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update basic profile info (name, bio, role)
// @route   PUT /api/users/profile/basic
// @access  Private
export const updateBasicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, bio, role, location, availability } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (role) user.role = role;
    if (location !== undefined) user.location = location;
    if (availability) user.availability = availability;

    // Check if profile should be marked as complete
    user.profileCompleted = checkProfileComplete(user);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      lookingFor: updatedUser.lookingFor,
      location: updatedUser.location,
      availability: updatedUser.availability,
      hackathons: updatedUser.hackathons,
      wins: updatedUser.wins,
      profileCompleted: updatedUser.profileCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user skills
// @route   PUT /api/users/profile/skills
// @access  Private
export const updateSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    user.skills = skills;

    // Check if profile should be marked as complete
    user.profileCompleted = checkProfileComplete(user);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      lookingFor: updatedUser.lookingFor,
      location: updatedUser.location,
      availability: updatedUser.availability,
      hackathons: updatedUser.hackathons,
      wins: updatedUser.wins,
      profileCompleted: updatedUser.profileCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user requirements (lookingFor)
// @route   PUT /api/users/profile/requirements
// @access  Private
export const updateRequirements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { lookingFor } = req.body;

    if (!lookingFor || !Array.isArray(lookingFor)) {
      return res.status(400).json({ message: 'lookingFor must be an array' });
    }

    user.lookingFor = lookingFor;

    // Check if profile should be marked as complete
    user.profileCompleted = checkProfileComplete(user);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      lookingFor: updatedUser.lookingFor,
      location: updatedUser.location,
      availability: updatedUser.availability,
      hackathons: updatedUser.hackathons,
      wins: updatedUser.wins,
      profileCompleted: updatedUser.profileCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (for explore/browse)
// @route   GET /api/users/all
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    // Get IDs to exclude: current user + already connected/pending + matched users
    const excludeIds = [
      currentUserId,
      ...(currentUser.pendingConnections || []),
    ];

    // Get matched user IDs from Match documents
    const matches = await Match.find({ users: currentUserId });
    matches.forEach(match => {
      match.users.forEach(userId => {
        if (userId.toString() !== currentUserId.toString()) {
          excludeIds.push(userId);
        }
      });
    });

    // Get all users except excluded ones, who have completed their profile
    const users = await User.find({
      _id: { $nin: excludeIds },
      profileCompleted: true,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
