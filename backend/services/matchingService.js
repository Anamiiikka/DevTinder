import User from '../models/User.js';

/**
 * Matching Algorithm Service
 * 
 * Hard Filtering:
 * - Filter users by required roles
 * - Filter users with matching skills
 * 
 * Scoring System:
 * - Common skills × 3
 * - Role match × 5
 * - Location match × 1
 * 
 * Returns top 10 candidates sorted by score
 */

export const findMatches = async (userId) => {
  try {
    // Get the current user
    const currentUser = await User.findById(userId);
    
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Hard filtering: Find users whose role is in currentUser's lookingFor
    const candidates = await User.find({
      _id: { $ne: userId }, // Exclude current user
      role: { $in: currentUser.lookingFor }, // User's role matches what current user is looking for
      profileCompleted: true, // Only show users who completed their profile
    }).select('-password');

    // Score each candidate
    const scoredCandidates = candidates.map(candidate => {
      let score = 0;

      // Common skills × 3
      const commonSkills = currentUser.skills.filter(skill =>
        candidate.skills.includes(skill)
      );
      score += commonSkills.length * 3;

      // Role match × 5 (if candidate is looking for current user's role)
      if (candidate.lookingFor.includes(currentUser.role)) {
        score += 5;
      }

      // Location match × 1
      if (
        currentUser.location &&
        candidate.location &&
        currentUser.location.toLowerCase() === candidate.location.toLowerCase()
      ) {
        score += 1;
      }

      return {
        user: candidate,
        score,
        commonSkills,
      };
    });

    // Sort by score (highest first) and return top 10
    const topMatches = scoredCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return topMatches;
  } catch (error) {
    throw error;
  }
};

export const checkMutualConnection = async (user1Id, user2Id) => {
  try {
    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);

    if (!user1 || !user2) {
      throw new Error('User not found');
    }

    // Check if user1 has user2 in pending connections
    const user1Connected = user2.pendingConnections.includes(user1Id);
    
    // Check if user2 has user1 in pending connections
    const user2Connected = user1.pendingConnections.includes(user2Id);

    return user1Connected && user2Connected;
  } catch (error) {
    throw error;
  }
};
