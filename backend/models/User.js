import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const ROLES = [
  'Frontend Dev',
  'Backend Dev',
  'Full Stack',
  'ML Engineer',
  'DevOps',
  'Mobile Dev',
  'Blockchain Dev',
  'UI/UX Designer',
  // Legacy roles for backward compatibility
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'Other',
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'Full Stack',
    },
    skills: {
      type: [String],
      default: [],
    },
    lookingFor: {
      type: [String],
      default: [],
    },
    seekingRoles: {
      type: [String],
      default: [],
    },
    seekingSkills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: '',
    },
    hackathons: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Weekends Only', 'Flexible'],
      default: 'Flexible',
    },
    pendingConnections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    matches: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    }],
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
