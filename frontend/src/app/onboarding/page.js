'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { userService } from '../../services';

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'QA Engineer',
];

const SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust',
  'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express',
  'Django', 'Flask', 'Spring Boot', 'Ruby on Rails',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL',
  'TensorFlow', 'PyTorch', 'Figma', 'Git',
];

const LOOKING_FOR = [
  { value: 'hackathon', label: 'Hackathon Teammates', icon: '🏆' },
  { value: 'project', label: 'Side Project Partners', icon: '🚀' },
  { value: 'mentorship', label: 'Mentorship', icon: '🎓' },
  { value: 'networking', label: 'Networking', icon: '🤝' },
  { value: 'cofounders', label: 'Co-founders', icon: '💡' },
];

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    role: '',
    skills: [],
    seekingRoles: [],
    seekingSkills: [],
    bio: '',
    location: '',
    lookingFor: [],
    github: '',
    linkedin: '',
    portfolio: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSeekingRoleToggle = (role) => {
    setFormData((prev) => ({
      ...prev,
      seekingRoles: prev.seekingRoles.includes(role)
        ? prev.seekingRoles.filter((r) => r !== role)
        : [...prev.seekingRoles, role],
    }));
  };

  const handleSeekingSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      seekingSkills: prev.seekingSkills.includes(skill)
        ? prev.seekingSkills.filter((s) => s !== skill)
        : [...prev.seekingSkills, skill],
    }));
  };

  const handleLookingForToggle = (value) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(value)
        ? prev.lookingFor.filter((v) => v !== value)
        : [...prev.lookingFor, value],
    }));
  };

  const handleNextStep = async () => {
    setError('');
    
    if (step === 1 && !formData.role) {
      setError('Please select your role');
      return;
    }
    
    if (step === 2 && formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    if (step === 3 && formData.seekingRoles.length === 0) {
      setError('Please select at least one role you\'re looking for');
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    // Final step - save profile
    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile({
        ...formData,
        profileCompleted: true,
      });
      setAuth(updatedUser, localStorage.getItem('token'));
      router.push('/discover');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-gradient w-full max-w-2xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/10 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Role */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">What's your role?</h2>
              <p className="text-gray-400 mb-6">Select the role that best describes you</p>
              
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      formData.role === role
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Your skills</h2>
              <p className="text-gray-400 mb-6">
                Select your tech skills ({formData.skills.length} selected)
              </p>
              
              <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto">
                {SKILLS.map((skill) => (
                  <motion.button
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      formData.skills.includes(skill)
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: What roles/skills are you looking for? */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Who are you looking for?</h2>
              <p className="text-gray-400 mb-6">Select the roles you want to find in teammates</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Roles ({formData.seekingRoles.length} selected)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => (
                    <motion.button
                      key={role}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSeekingRoleToggle(role)}
                      className={`p-3 rounded-xl text-left text-sm transition-all ${
                        formData.seekingRoles.includes(role)
                          ? 'bg-green-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {role}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Skills (optional)</h3>
                <p className="text-gray-400 text-sm mb-3">Skills you'd like your teammates to have</p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {SKILLS.map((skill) => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSeekingSkillToggle(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        formData.seekingSkills.includes(skill)
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Additional Info */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Almost there!</h2>
              <p className="text-gray-400 mb-6">Tell us more about yourself</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What are you looking for?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LOOKING_FOR.map((item) => (
                      <motion.button
                        key={item.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleLookingForToggle(item.value)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          formData.lookingFor.includes(item.value)
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {item.icon} {item.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Tell others about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="input-field"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="input-field"
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio</label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNextStep}
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : step < TOTAL_STEPS ? 'Continue' : 'Complete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
