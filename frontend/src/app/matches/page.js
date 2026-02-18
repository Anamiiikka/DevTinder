'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { matchService } from '../../services';

export default function MatchesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, activeTab, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'matches') {
        const data = await matchService.getMyMatches();
        setMatches(data);
      } else if (activeTab === 'requests') {
        const data = await matchService.getPendingRequests();
        setMatches(data);
      } else {
        const data = await matchService.getSentRequests();
        setMatches(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await matchService.connectWithUser(userId);
      fetchData();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleChat = (matchId) => {
    router.push(`/chat/${matchId}`);
  };

  const tabs = [
    { id: 'matches', label: 'Matches', icon: '💕' },
    { id: 'requests', label: 'Requests', icon: '📩' },
    { id: 'sent', label: 'Sent', icon: '📤' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Connections</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-lg">Loading...</div>
          </div>
        ) : matches.length === 0 ? (
          <div className="card-gradient rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">
              {activeTab === 'matches' ? '💔' : activeTab === 'requests' ? '📭' : '📫'}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === 'matches'
                ? 'No matches yet'
                : activeTab === 'requests'
                ? 'No pending requests'
                : 'No sent requests'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'matches'
                ? 'Start swiping to find your perfect teammates!'
                : activeTab === 'requests'
                ? 'When someone likes you, they will appear here'
                : 'Developers you like will appear here'}
            </p>
            {activeTab !== 'requests' && (
              <button onClick={() => router.push('/discover')} className="btn-primary">
                Discover Developers
              </button>
            )}
          </div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {matches.map((match, index) => {
                const profile = match.user || match;
                return (
                  <motion.div
                    key={profile._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-gradient rounded-2xl p-4 flex items-center gap-4"
                  >
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-600 flex-shrink-0">
                      {profile.profilePicture ? (
                        <img
                          src={profile.profilePicture}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/50">
                          {profile.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{profile.name}</h3>
                      <p className="text-primary-400 text-sm">{profile.role || 'Developer'}</p>
                      {profile.skills && profile.skills.length > 0 && (
                        <p className="text-gray-400 text-xs truncate">
                          {profile.skills.slice(0, 3).join(' • ')}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {activeTab === 'matches' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChat(match.matchId || match._id)}
                          className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                        >
                          💬 Chat
                        </motion.button>
                      )}
                      {activeTab === 'requests' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptRequest(profile._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                        >
                          ✓ Accept
                        </motion.button>
                      )}
                      {activeTab === 'sent' && (
                        <span className="px-4 py-2 bg-white/10 text-gray-400 rounded-xl text-sm">
                          Pending
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
