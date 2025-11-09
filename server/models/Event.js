const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  maxAttendees: {
    type: Number,
    required: [true, 'Please add maximum number of attendees'],
    min: [1, 'Maximum attendees must be at least 1']
  },
  tags: {
    type: [String],
    required: true
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
EventSchema.index({ title: 'text', description: 'text', tags: 'text' });
EventSchema.index({ date: 1 });
EventSchema.index({ organizer: 1 });

// Virtual for attendees count
EventSchema.virtual('attendeesCount').get(function() {
  return this.attendees.length;
});

// Check if event is full
EventSchema.methods.isFull = function() {
  return this.attendees.length >= this.maxAttendees;
};

// Check if user is registered
EventSchema.methods.isRegistered = function(userId) {
  return this.attendees.some(att => String(att) === String(userId));
};

module.exports = mongoose.model('Event', EventSchema); 