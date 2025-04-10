const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  getConnections,
  getNotifications,
  markNotificationAsRead
} = require('../controllers/userController');

router.use(protect);

router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/profile', updateProfile);
router.get('/connections', getConnections);
router.get('/notifications', getNotifications);
router.put('/notifications/:id', markNotificationAsRead);

module.exports = router; 