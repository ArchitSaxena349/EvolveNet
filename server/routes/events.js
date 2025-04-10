const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  addSpeaker,
  removeSpeaker,
  getEventAttendees,
  getEventSpeakers,
  addEventFeedback,
  getEventFeedback
} = require('../controllers/eventController');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);
router.get('/:id/attendees', getEventAttendees);
router.get('/:id/speakers', getEventSpeakers);
router.get('/:id/feedback', getEventFeedback);

// Protected routes
router.use(protect);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.post('/:id/register', registerForEvent);
router.post('/:id/cancel', cancelRegistration);
router.post('/:id/speakers', addSpeaker);
router.delete('/:id/speakers/:speakerId', removeSpeaker);
router.post('/:id/feedback', addEventFeedback);

module.exports = router; 