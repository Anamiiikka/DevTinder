'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { matchService, userService } from '../../services';

export default function DiscoverPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && !user.profileCompleted) {
      router.push('/onboarding');
      return;
    }
    fetchProfiles();
  }, [isAuthenticated, user, router]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      // Get all registered users for exploration
      const data = await userService.getAllUsers();
      setProfiles(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (swipeDirection) => {
    if (profiles.length === 0 || currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    setDirection(swipeDirection);

    try {
      if (swipeDirection === 'right' || swipeDirection === 'up') {
        const result = await matchService.connectWithUser(currentProfile._id);
        if (result.status === 'matched' || result.isMutual) {
          setMatchedUser(currentProfile);
          setShowMatch(true);
        }
      } else {
        await matchService.passOnUser(currentProfile._id);
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 300);
  };

  const currentProfile = profiles[currentIndex];

  const cardVariants = {
    enter: { scale: 0.95, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: (direction) => ({
      x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
      y: direction === 'up' ? -300 : 0,
      opacity: 0,
      rotate: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Finding developers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Card Stack */}
        <div className="relative h-[600px] mb-8">
          <AnimatePresence custom={direction}>
            {currentProfile ? (
              <motion.div
                key={currentProfile._id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="absolute inset-0 card-gradient rounded-3xl overflow-hidden"
              >
                {/* Profile Image */}
                <div className="h-2/3 relative bg-gradient-to-b from-primary-600/30 to-transparent">
                  {currentProfile.profilePicture ? (
                    <img
                      src={currentProfile.profilePicture}
                      alt={currentProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
                      <span className="text-9xl font-bold text-white/30">
                        {currentProfile.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
                  
                  {/* Match Score Badge */}
                  {currentProfile.matchScore && (
                    <div className="absolute top-4 right-4 bg-primary-500 px-3 py-1 rounded-full">
                      <span className="text-white font-semibold">
                        {Math.round(currentProfile.matchScore)}% Match
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{currentProfile.name}</h2>
                    {currentProfile.location && (
                      <span className="text-gray-400 text-sm">📍 {currentProfile.location}</span>
                    )}
                  </div>
                  
                  <p className="text-primary-400 font-medium mb-3">
                    {currentProfile.role || 'Developer'}
                  </p>
                  
                  {currentProfile.bio && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{currentProfile.bio}</p>
                  )}
                  
                  {/* Skills */}
                  {currentProfile.skills && currentProfile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {currentProfile.skills.length > 5 && (
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-400">
                          +{currentProfile.skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 card-gradient rounded-3xl flex flex-col items-center justify-center text-center p-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-2">No more profiles</h3>
                <p className="text-gray-400 mb-6">
                  You've seen all available developers. Check back later for new matches!
                </p>
                <button
                  onClick={fetchProfiles}
                  className="btn-primary"
                >
                  Refresh
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {currentProfile && (
          <div className="flex justify-center items-center gap-6">
            {/* Pass Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-white/10 border-2 border-red-400 flex items-center justify-center hover:bg-red-400/20 transition-colors"
            >
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Super Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('up')}
              className="w-14 h-14 rounded-full bg-white/10 border-2 border-blue-400 flex items-center justify-center hover:bg-blue-400/20 transition-colors"
            >
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </motion.button>

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 rounded-full bg-white/10 border-2 border-green-400 flex items-center justify-center hover:bg-green-400/20 transition-colors"
            >
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.button>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Tip: Use arrow keys to swipe (← Pass, → Like, ↑ Super Like)
        </p>
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMatch(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-primary-600 to-primary-800 rounded-3xl p-8 text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">It's a Match!</h2>
              <p className="text-white/80 mb-6">
                You and {matchedUser.name} have liked each other
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowMatch(false);
                    router.push('/matches');
                  }}
                  className="flex-1 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                >
                  View Matches
                </button>
                <button
                  onClick={() => setShowMatch(false)}
                  className="flex-1 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors"
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
