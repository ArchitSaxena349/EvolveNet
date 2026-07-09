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
router.get('/:id([a-f0-9]{24})', [auth, check('id', 'Invalid user id').isMongoId()], userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put(
  '/:id(^(?!profile)[a-f0-9]{24}$)',
  [
    auth,
    check('name', 'Name is required').trim().notEmpty(),
    check('name', 'Name must be between 2 and 50 characters').isLength({ min: 2, max: 50 }),
    check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
    check('role', 'Role must be user or admin').optional().isIn(['user', 'admin'])
  ],
  userController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/profile/content', auth, userController.clearProfile);
router.delete('/profile/experience/:experienceId', auth, userController.deleteExperience);
router.delete('/profile/education/:educationId', auth, userController.deleteEducation);
router.delete('/profile', auth, userController.deleteOwnAccount);

router.delete('/:id([a-f0-9]{24})', [auth, check('id', 'Invalid user id').isMongoId()], userController.deleteUser);

// Profile routes MUST come before /:id to avoid route collision
// @route   PUT /api/users/profile/experience
// @desc    Add experience to user's profile
// @access  Private
router.put(
  '/profile/experience',
  [
    auth,
    check('title', 'Title is required').trim().notEmpty(),
    check('title', 'Title must be between 2 and 100 characters').isLength({ min: 2, max: 100 }),
    check('company', 'Company is required').trim().notEmpty(),
    check('company', 'Company must be between 2 and 100 characters').isLength({ min: 2, max: 100 }),
    check('location', 'Location must be between 2 and 100 characters').optional({ checkFalsy: true }).isLength({ min: 2, max: 100 }),
    check('from', 'Start date is required').notEmpty(),
    check('from', 'Start date must be a valid ISO date').isISO8601(),
    check('to', 'End date must be a valid ISO date').optional({ checkFalsy: true }).isISO8601(),
    check('description', 'Description must be 500 characters or less').optional({ checkFalsy: true }).isLength({ max: 500 }),
    check('current', 'Current must be a boolean').optional().isBoolean()
  ],
  userController.addExperience
);

// @route   PUT /api/users/profile/education
// @desc    Add education to user's profile
// @access  Private
router.put(
  '/profile/education',
  [
    auth,
    check('school', 'School is required').trim().notEmpty(),
    check('school', 'School must be between 2 and 100 characters').isLength({ min: 2, max: 100 }),
    check('degree', 'Degree is required').trim().notEmpty(),
    check('degree', 'Degree must be between 2 and 100 characters').isLength({ min: 2, max: 100 }),
    check('fieldofstudy', 'Field of study is required').trim().notEmpty(),
    check('fieldofstudy', 'Field of study must be between 2 and 100 characters').isLength({ min: 2, max: 100 }),
    check('from', 'Start date is required').notEmpty(),
    check('from', 'Start date must be a valid ISO date').isISO8601(),
    check('to', 'End date must be a valid ISO date').optional({ checkFalsy: true }).isISO8601(),
    check('description', 'Description must be 500 characters or less').optional({ checkFalsy: true }).isLength({ max: 500 }),
    check('current', 'Current must be a boolean').optional().isBoolean()
  ],
  userController.addEducation
);

// @route   PUT /api/users/profile/skills
// @desc    Add or remove skills from user's profile
// @access  Private
router.put(
  '/profile/skills',
  [
    auth,
    check('skill', 'Skill is required').trim().notEmpty(),
    check('skill', 'Skill must be between 2 and 50 characters').isLength({ min: 2, max: 50 }),
    check('action', 'Action must be add or delete').optional().isIn(['delete'])
  ],
  userController.updateSkills
);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    auth,
    check('name', 'Name is required').trim().notEmpty(),
    check('name', 'Name must be between 2 and 50 characters').isLength({ min: 2, max: 50 }),
    check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters').optional({ checkFalsy: true }).isLength({ min: 6 }),
    check('bio', 'Bio must be 500 characters or less').optional({ checkFalsy: true }).isLength({ max: 500 }),
    check('location', 'Location must be 100 characters or less').optional({ checkFalsy: true }).isLength({ max: 100 }),
    check('picture', 'Invalid picture data').optional({ checkFalsy: true }).isLength({ max: 2500000 }),
    check('coverPhoto', 'Invalid cover photo data').optional({ checkFalsy: true }).isLength({ max: 2500000 })
  ],
  userController.updateProfile
);

module.exports = router;
