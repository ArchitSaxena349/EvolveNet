const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  tags: {
    type: [String],
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
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
GroupSchema.index({ name: 'text', description: 'text', tags: 'text' });
GroupSchema.index({ creator: 1 });

// Virtual for members count
GroupSchema.virtual('membersCount').get(function() {
  return this.members.length;
});

// Check if user is member
GroupSchema.methods.isMember = function(userId) {
  return this.members.some(member => String(member) === String(userId));
};

// Check if user is admin
GroupSchema.methods.isAdmin = function(userId) {
  return this.admins.some(admin => String(admin) === String(userId));
};

module.exports = mongoose.model('Group', GroupSchema); 