const Event = require('../models/Event');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, maxAttendees, tags } = req.body;

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      maxAttendees,
      tags,
      organizer: req.user.id
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
const updateEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, maxAttendees, tags } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    // Update event fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.maxAttendees = maxAttendees || event.maxAttendees;
    event.tags = tags || event.tags;

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is already registered
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ error: 'User already registered for this event' });
    }

    // Check if event is full
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ error: 'Event is full' });
    }

    // Add user to attendees
    event.attendees.push(req.user.id);
    await event.save();

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   DELETE /api/events/:id/register
// @desc    Unregister from event
// @access  Private
const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is registered
    if (!event.attendees.includes(req.user.id)) {
      return res.status(400).json({ error: 'User is not registered for this event' });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.user.id
    );
    await event.save();

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
}; 