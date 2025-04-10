const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', eventController.getEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', eventController.getEventById);

// @route   POST /api/events
// @desc    Create event
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('maxAttendees', 'Maximum attendees is required').isInt({ min: 1 }),
      check('tags', 'Tags are required').not().isEmpty()
    ]
  ],
  eventController.createEvent
);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('maxAttendees', 'Maximum attendees is required').isInt({ min: 1 }),
      check('tags', 'Tags are required').not().isEmpty()
    ]
  ],
  eventController.updateEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', auth, eventController.deleteEvent);

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private
router.post('/:id/register', auth, eventController.registerForEvent);

// @route   DELETE /api/events/:id/register
// @desc    Unregister from event
// @access  Private
router.delete('/:id/register', auth, eventController.unregisterFromEvent);

module.exports = router; 