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
    check('title', 'Title is required').trim().notEmpty(),
    check('title', 'Title must be between 2 and 120 characters').isLength({ min: 2, max: 120 }),
    check('description', 'Description is required').trim().notEmpty(),
    check('description', 'Description must be between 10 and 2000 characters').isLength({ min: 10, max: 2000 }),
    check('date', 'Date is required').notEmpty(),
    check('date', 'Date must be a valid ISO date').isISO8601(),
    check('location', 'Location is required').trim().notEmpty(),
    check('location', 'Location must be between 2 and 120 characters').isLength({ min: 2, max: 120 }),
    check('maxAttendees', 'Maximum attendees is required').isInt({ min: 1, max: 10000 }),
    check('tags', 'Tags are required').isArray({ min: 1 }),
    check('tags.*', 'Each tag must be a non-empty string').trim().notEmpty()
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
    check('title', 'Title is required').trim().notEmpty(),
    check('title', 'Title must be between 2 and 120 characters').isLength({ min: 2, max: 120 }),
    check('description', 'Description is required').trim().notEmpty(),
    check('description', 'Description must be between 10 and 2000 characters').isLength({ min: 10, max: 2000 }),
    check('date', 'Date is required').notEmpty(),
    check('date', 'Date must be a valid ISO date').isISO8601(),
    check('location', 'Location is required').trim().notEmpty(),
    check('location', 'Location must be between 2 and 120 characters').isLength({ min: 2, max: 120 }),
    check('maxAttendees', 'Maximum attendees is required').isInt({ min: 1, max: 10000 }),
    check('tags', 'Tags are required').isArray({ min: 1 }),
    check('tags.*', 'Each tag must be a non-empty string').trim().notEmpty()
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