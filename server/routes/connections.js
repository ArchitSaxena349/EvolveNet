const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const auth = require('../middleware/auth');

// @route   GET /api/connections
// @desc    Get user connections
// @access  Private
router.get('/', auth, connectionController.getConnections);

// @route   GET /api/connections/requests
// @desc    Get connection requests
// @access  Private
router.get('/requests', auth, connectionController.getConnectionRequests);

// @route   POST /api/connections/:userId
// @desc    Send connection request
// @access  Private
router.post('/:userId', auth, connectionController.sendConnectionRequest);

// @route   PUT /api/connections/:id/accept
// @desc    Accept connection request
// @access  Private
router.put('/:id/accept', auth, connectionController.acceptConnectionRequest);

// @route   PUT /api/connections/:id/reject
// @desc    Reject connection request
// @access  Private
router.put('/:id/reject', auth, connectionController.rejectConnectionRequest);

// @route   DELETE /api/connections/:id
// @desc    Remove connection
// @access  Private
router.delete('/:id', auth, connectionController.removeConnection);

module.exports = router; 