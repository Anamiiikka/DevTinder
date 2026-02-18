import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { userService } from '../services';

const ROLES = [
  'Frontend Dev',
  'Backend Dev',
  'Full Stack',
  'ML Engineer',
  'DevOps',
  'Mobile Dev',
  'Blockchain Dev',
  'UI/UX Designer',
];

const TECH_SKILLS = [
  'React',
  'Angular',
  'Vue.js',
  'Next.js',
  'Node.js',
  'Express.js',
  'Python',
  'Django',
  'Flask',
  'FastAPI',
  'Java',
  'Spring Boot',
  'C++',
  'Go',
  'Rust',
  'TypeScript',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Firebase',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'REST API',
  'Machine Learning',
  'TensorFlow',
  'PyTorch',
  'Figma',
  'Adobe XD',
  'UI Design',
  'UX Research',
  'Solidity',
  'Web3',
  'React Native',
  'Flutter',
];

const AVAILABILITY_OPTIONS = ['Full Time', 'Part Time', 'Weekends Only', 'Flexible'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    role: user?.role || '',
    location: user?.location || '',
    availability: user?.availability || 'Flexible',
    skills: user?.skills || [],
    lookingFor: user?.lookingFor || [],
  });

  // Redirect if profile is already completed
  useEffect(() => {
    if (user?.profileCompleted) {
      navigate('/matches');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleLookingFor = (role) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(role)
        ? prev.lookingFor.filter((r) => r !== role)
        : [...prev.lookingFor, role],
    }));
  };

  // Step 1: Save Basic Info
  const handleSaveBasicInfo = async () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await userService.updateBasicProfile({
        name: formData.name,
        bio: formData.bio,
        role: formData.role,
        location: formData.location,
        availability: formData.availability,
      });
      updateUser(updatedUser);
      setSuccess('Basic info saved!');
      setTimeout(() => {
        setSuccess('');
        setStep(2);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save basic info');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Save Skills
  const handleSaveSkills = async () => {
    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await userService.updateSkills(formData.skills);
      updateUser(updatedUser);
      setSuccess('Skills saved!');
      setTimeout(() => {
        setSuccess('');
        setStep(3);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skills');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save Requirements and Complete Profile
  const handleSaveRequirements = async () => {
    if (formData.lookingFor.length === 0) {
      setError('Please select at least one role you are looking for');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await userService.updateRequirements(formData.lookingFor);
      updateUser(updatedUser);
      setSuccess('Profile completed! Redirecting...');
      setTimeout(() => {
        navigate('/matches');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save requirements');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    setSuccess('');
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Step {step} of 3</p>
          <div className="mt-4 flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
              <p className="text-gray-600">Tell us about yourself and your role</p>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="input-field"
                  placeholder="Tell potential teammates about yourself, your experience, and what you're passionate about..."
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select your primary role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., San Francisco, CA or Remote"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="input-field"
                >
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveBasicInfo}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          )}

          {/* Step 2: Tech Stack / Skills */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Tech Stack</h2>
              <p className="text-gray-600">
                Select the technologies and skills you're proficient in ({formData.skills.length} selected)
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {TECH_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                      formData.skills.includes(skill)
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="flex space-x-4">
                <button onClick={handleBack} className="flex-1 btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleSaveSkills}
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Requirements / Looking For */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Who Are You Looking For?</h2>
              <p className="text-gray-600">
                Select the roles you need for your team ({formData.lookingFor.length} selected)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ROLES.filter((role) => role !== formData.role).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleLookingFor(role)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors text-left ${
                      formData.lookingFor.includes(role)
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                    }`}
                  >
                    <span className="font-medium">{role}</span>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Tip:</span> Select roles that complement your skills. 
                  For example, if you're a Frontend Dev, you might want to connect with Backend Devs or UI/UX Designers.
                </p>
              </div>

              <div className="flex space-x-4">
                <button onClick={handleBack} className="flex-1 btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleSaveRequirements}
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? 'Completing...' : 'Complete Profile & Find Team'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
