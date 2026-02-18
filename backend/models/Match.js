import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    chatId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a unique chatId before saving
matchSchema.pre('save', function (next) {
  if (!this.chatId) {
    this.chatId = this._id.toString();
  }
  next();
});

const Match = mongoose.model('Match', matchSchema);

export default Match;
