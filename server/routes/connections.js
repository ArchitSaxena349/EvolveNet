const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnections,
  getPendingRequests,
  removeConnection
} = require('../controllers/connectionController');

router.use(protect);

router.post('/', sendConnectionRequest);
router.get('/', getConnections);
router.get('/pending', getPendingRequests);
router.put('/:id/accept', acceptConnectionRequest);
router.put('/:id/reject', rejectConnectionRequest);
router.delete('/:id', removeConnection);

module.exports = router; 