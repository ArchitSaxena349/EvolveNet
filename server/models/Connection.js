const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  connectedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
ConnectionSchema.index({ user: 1, connectedUser: 1 }, { unique: true });
ConnectionSchema.index({ status: 1 });

// Prevent duplicate connections
ConnectionSchema.pre('save', async function (next) {
  // Check if we are checking against OTHER connections
  const existingConnection = await this.constructor.findOne({
    user: this.user,
    connectedUser: this.connectedUser,
    _id: { $ne: this._id }
  });

  if (existingConnection) {
    throw new Error('Connection already exists');
  }

  next();
});

module.exports = mongoose.model('Connection', ConnectionSchema); 