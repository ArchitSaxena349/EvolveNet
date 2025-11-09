const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', auth, userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', auth, userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  userController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', auth, userController.deleteUser);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  userController.updateProfile
);

// @route   PUT /api/users/profile/experience
// @desc    Add experience to user's profile
// @access  Private
router.put('/profile/experience', auth, userController.addExperience);

// @route   PUT /api/users/profile/education
// @desc    Add education to user's profile
// @access  Private
router.put('/profile/education', auth, userController.addEducation);

// @route   PUT /api/users/profile/skills
// @desc    Add or remove skills from user's profile
// @access  Private
router.put('/profile/skills', auth, userController.updateSkills);

module.exports = router; 