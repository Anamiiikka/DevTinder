'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { userService } from '../../services';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    role: '',
    skills: [],
    lookingFor: [],
    github: '',
    linkedin: '',
    portfolio: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        role: user.role || '',
        skills: user.skills || [],
        lookingFor: user.lookingFor || [],
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || '',
      });
    }
  }, [user, isAuthenticated, router]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile(formData);
      setAuth(updatedUser, localStorage.getItem('token'));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="card-gradient rounded-3xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-600 flex-shrink-0">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/50">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xl font-bold mb-2"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
              )}
              <p className="text-primary-400 font-medium">{user.role || 'Developer'}</p>
              {user.location && (
                <p className="text-gray-400 text-sm mt-1">📍 {user.location}</p>
              )}
            </div>

            {/* Edit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={loading}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              {loading ? 'Saving...' : editing ? 'Save' : 'Edit'}
            </motion.button>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">About</h3>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field resize-none w-full"
                rows={3}
                placeholder="Tell others about yourself..."
              />
            ) : (
              <p className="text-gray-300">{user.bio || 'No bio yet'}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="card-gradient rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(editing ? formData.skills : user.skills || []).map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  editing
                    ? 'bg-primary-500/20 text-primary-400 cursor-pointer hover:bg-red-500/20 hover:text-red-400'
                    : 'bg-white/10 text-gray-300'
                }`}
                onClick={() => {
                  if (editing) {
                    setFormData({
                      ...formData,
                      skills: formData.skills.filter((_, i) => i !== index),
                    });
                  }
                }}
              >
                {skill}
                {editing && ' ×'}
              </span>
            ))}
            {(user.skills || []).length === 0 && !editing && (
              <span className="text-gray-500">No skills added</span>
            )}
          </div>
        </div>

        {/* Looking For */}
        <div className="card-gradient rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Looking For</h3>
          <div className="flex flex-wrap gap-2">
            {(editing ? formData.lookingFor : user.lookingFor || []).map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
            {(user.lookingFor || []).length === 0 && !editing && (
              <span className="text-gray-500">Not specified</span>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="card-gradient rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="input-field"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="input-field"
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Portfolio</label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors"
                >
                  GitHub
                </a>
              )}
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {user.portfolio && (
                <a
                  href={user.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Portfolio
                </a>
              )}
              {!user.github && !user.linkedin && !user.portfolio && (
                <span className="text-gray-500">No links added</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {editing && (
            <button
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: user.name || '',
                  bio: user.bio || '',
                  location: user.location || '',
                  role: user.role || '',
                  skills: user.skills || [],
                  lookingFor: user.lookingFor || [],
                  github: user.github || '',
                  linkedin: user.linkedin || '',
                  portfolio: user.portfolio || '',
                });
              }}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
