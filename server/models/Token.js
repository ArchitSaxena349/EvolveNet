const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  refreshToken: {
    type: String,
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  // Mark token as revoked/blacklisted without deleting it
  blacklisted: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
TokenSchema.index({ user: 1 });
TokenSchema.index({ refreshToken: 1 });

// Add method to check if token is expired
TokenSchema.methods.isExpired = function() {
  return Date.now() >= this.expiresAt;
};

module.exports = mongoose.model('Token', TokenSchema); 