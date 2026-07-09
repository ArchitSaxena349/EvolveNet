const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

// @route   GET /api/groups
// @desc    Get all groups
// @access  Public
router.get('/', groupController.getGroups);

// @route   GET /api/groups/:id
// @desc    Get group by ID
// @access  Public
router.get('/:id', groupController.getGroupById);

// @route   POST /api/groups
// @desc    Create group
// @access  Private
router.post(
  '/',
  [
    auth,
    check('name', 'Name is required').trim().notEmpty(),
    check('name', 'Name must be between 2 and 100 characters').isLength({ min: 2, max: 100 }),
    check('description', 'Description is required').trim().notEmpty(),
    check('description', 'Description must be between 10 and 2000 characters').isLength({ min: 10, max: 2000 }),
    check('tags', 'Tags are required').isArray({ min: 1 }),
    check('tags.*', 'Each tag must be a non-empty string').trim().notEmpty(),
    check('isPrivate', 'isPrivate must be a boolean').optional().isBoolean()
  ],
  groupController.createGroup
);

// @route   PUT /api/groups/:id
// @desc    Update group
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('name', 'Name is required').trim().notEmpty(),
    check('name', 'Name must be between 2 and 100 characters').isLength({ min: 2, max: 100 }),
    check('description', 'Description is required').trim().notEmpty(),
    check('description', 'Description must be between 10 and 2000 characters').isLength({ min: 10, max: 2000 }),
    check('tags', 'Tags are required').isArray({ min: 1 }),
    check('tags.*', 'Each tag must be a non-empty string').trim().notEmpty(),
    check('isPrivate', 'isPrivate must be a boolean').optional().isBoolean()
  ],
  groupController.updateGroup
);

// @route   DELETE /api/groups/:id
// @desc    Delete group
// @access  Private
router.delete('/:id', auth, groupController.deleteGroup);

// @route   POST /api/groups/:id/join
// @desc    Join group
// @access  Private
router.post('/:id/join', auth, groupController.joinGroup);

// @route   DELETE /api/groups/:id/leave
// @desc    Leave group
// @access  Private
router.delete('/:id/leave', auth, groupController.leaveGroup);

module.exports = router; 