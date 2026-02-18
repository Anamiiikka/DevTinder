import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { chatService, matchService } from '../services';
import { initSocket, getSocket } from '../services/socket';
import Navbar from '../components/Navbar';

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchMatchDetails();

    // Initialize socket
    if (!socketRef.current) {
      socketRef.current = initSocket(token);
      
      // Join the chat room
      socketRef.current.emit('join_chat', matchId);

      // Listen for new messages
      socketRef.current.on('new_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_chat', matchId);
      }
    };
  }, [matchId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await chatService.getChatMessages(matchId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchDetails = async () => {
    try {
      const matches = await matchService.getMyMatches();
      const currentMatch = matches.find((m) => m.matchId === matchId);
      if (currentMatch) {
        setMatchedUser(currentMatch.user);
      }
    } catch (err) {
      console.error('Failed to fetch match details:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      // Emit message through socket
      socketRef.current.emit('send_message', {
        chatId: matchId,
        text: messageText,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
      setNewMessage(messageText);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Chat Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/matches')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          {matchedUser && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">{matchedUser.name}</h2>
              <p className="text-sm text-gray-600">{matchedUser.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isMyMessage = message.senderId._id === user._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      isMyMessage
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900 shadow'
                    }`}
                  >
                    {!isMyMessage && (
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {message.senderId.name}
                      </p>
                    )}
                    <p>{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMyMessage ? 'text-primary-200' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 input-field"
            />
            <button type="submit" className="btn-primary px-6">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
