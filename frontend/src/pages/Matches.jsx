import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { matchService } from '../services';
import Navbar from '../components/Navbar';

const Matches = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'connections'
  const [connectingUserId, setConnectingUserId] = useState(null);

  useEffect(() => {
    fetchMatches();
    fetchMyMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await matchService.findMatches();
      setMatches(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyMatches = async () => {
    try {
      const data = await matchService.getMyMatches();
      setMyMatches(data);
    } catch (err) {
      console.error('Failed to fetch my matches:', err);
    }
  };

  const handleConnect = async (userId) => {
    setConnectingUserId(userId);
    try {
      const response = await matchService.connectWithUser(userId);
      
      if (response.isMutual) {
        alert('Match created! You can now chat with this user.');
        await fetchMyMatches();
        setMatches(matches.filter((match) => match.user._id !== userId));
      } else {
        alert('Connection request sent!');
        setMatches(matches.filter((match) => match.user._id !== userId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to connect');
    } finally {
      setConnectingUserId(null);
    }
  };

  const handleChatClick = (matchId) => {
    navigate(`/chat/${matchId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Teammates</h1>
          <p className="text-gray-600">
            Discover developers looking for teammates like you
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'discover'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'connections'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Connections ({myMatches.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            {matches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">No matches found</p>
                <p className="text-gray-500">
                  Try updating your profile to find more teammates
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <div key={match.user._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{match.user.name}</h3>
                        <p className="text-primary-600 font-medium">{match.user.role}</p>
                      </div>
                      <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        Score: {match.score}
                      </div>
                    </div>

                    {match.user.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{match.user.bio}</p>
                    )}

                    {match.user.location && (
                      <p className="text-gray-500 text-sm mb-2">📍 {match.user.location}</p>
                    )}
                    
                    <p className="text-gray-500 text-sm mb-4">⏰ {match.user.availability}</p>

                    {match.commonSkills && match.commonSkills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Common Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {match.commonSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {match.commonSkills.length > 4 && (
                            <span className="text-xs text-gray-500">
                              +{match.commonSkills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {match.user.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {match.user.skills.length > 5 && (
                          <span className="text-xs text-gray-500">
                            +{match.user.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleConnect(match.user._id)}
                      disabled={connectingUserId === match.user._id}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {connectingUserId === match.user._id ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div>
            {myMatches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">No connections yet</p>
                <p className="text-gray-500">
                  Start connecting with developers to build your team
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myMatches.map((match) => (
                  <div key={match.matchId} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{match.user.name}</h3>
                    <p className="text-primary-600 font-medium mb-4">{match.user.role}</p>

                    {match.user.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{match.user.bio}</p>
                    )}

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {match.user.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleChatClick(match.matchId)}
                      className="w-full btn-primary"
                    >
                      💬 Chat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
