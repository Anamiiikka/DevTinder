'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../../store/authStore';
import { chatService, matchService } from '../../../services';
import { initSocket, joinRoom, sendMessage, onNewMessage, disconnectSocket } from '../../../services/socket';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId;
  const { user, token, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [match, setMatch] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketInitialized = useRef(false);

  // Fetch match data first
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchMatchAndMessages();
  }, [matchId, isAuthenticated, router]);

  // Initialize socket AFTER we have the chatId
  useEffect(() => {
    if (!token || !chatId || socketInitialized.current) return;

    socketInitialized.current = true;
    initSocket(token);
    joinRoom(chatId);

    // Listen for new messages
    const handleMessage = (message) => {
      // Skip if this is our own message (already added optimistically)
      const senderId = message.senderId?._id || message.senderId;
      if (senderId === user?._id) return;
      
      setMessages((prev) => [...prev, message]);
    };
    onNewMessage(handleMessage);

    return () => {
      socketInitialized.current = false;
      disconnectSocket();
    };
  }, [token, chatId, user?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMatchAndMessages = async () => {
    try {
      setLoading(true);
      const [matchData, messagesData] = await Promise.all([
        matchService.getMyMatches(),
        chatService.getMessages(matchId),
      ]);
      
      // Find the specific match (API returns matchId, not _id)
      const currentMatch = matchData.find((m) => m.matchId === matchId || m._id === matchId);
      setMatch(currentMatch);
      // Use the match's chatId (which defaults to matchId)
      setChatId(currentMatch?.chatId || matchId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      // Send via socket using the correct chatId
      sendMessage(chatId, newMessage);
      
      // Optimistically add to UI with backend-compatible format
      const optimisticMessage = {
        _id: Date.now().toString(),
        senderId: { _id: user._id, name: user.name },
        text: newMessage,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const otherUser = match?.users?.find((u) => u._id !== user?._id) || match?.user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 bg-[#1a1a2e]/95 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/matches')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {otherUser && (
            <>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-600">
                {otherUser.profilePicture ? (
                  <img
                    src={otherUser.profilePicture}
                    alt={otherUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white/50">
                    {otherUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-white font-semibold">{otherUser.name}</h2>
                <p className="text-gray-400 text-sm">{otherUser.role || 'Developer'}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👋</div>
              <h3 className="text-xl font-bold text-white mb-2">Start the conversation!</h3>
              <p className="text-gray-400">
                Say hi to {otherUser?.name || 'your match'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => {
                const isOwn = message.senderId === user?._id || message.senderId?._id === user?._id;
                return (
                  <motion.div
                    key={message._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        isOwn
                          ? 'bg-primary-500 text-white rounded-br-md'
                          : 'bg-white/10 text-gray-200 rounded-bl-md'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-[#1a1a2e]/95 backdrop-blur-sm border-t border-white/10 px-4 py-4">
        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input-field"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </motion.button>
        </form>
      </div>
    </div>
  );
}
