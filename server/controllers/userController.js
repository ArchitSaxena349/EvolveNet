const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's tokens
    await Token.deleteMany({ user: user._id });

    // Delete user
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, password, bio, location } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;

    // Update profile fields
    if (bio || location) {
      user.profile = user.profile || {};
      if (bio) user.profile.bio = bio;
      if (location) user.profile.location = location;
    }

    if (password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Add experience to profile
// @route   PUT /api/users/profile/experience
// @access  Private
const addExperience = async (req, res) => {
  try {
    const exp = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profile = user.profile || {};
    user.profile.experience = user.profile.experience || [];
    // push new experience at the beginning
    user.profile.experience.unshift(exp);

    await user.save();
    return res.json(user.profile.experience);
  } catch (err) {
    console.error('addExperience error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Add education to profile
// @route   PUT /api/users/profile/education
// @access  Private
const addEducation = async (req, res) => {
  try {
    const edu = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profile = user.profile || {};
    user.profile.education = user.profile.education || [];
    user.profile.education.unshift(edu);

    await user.save();
    return res.json(user.profile.education);
  } catch (err) {
    console.error('addEducation error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Add or remove skills
// @route   PUT /api/users/profile/skills
// @access  Private
const updateSkills = async (req, res) => {
  try {
    const { skill, action } = req.body;
    if (!skill) return res.status(400).json({ error: 'Skill is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profile = user.profile || {};
    user.profile.skills = user.profile.skills || [];

    if (action === 'delete') {
      user.profile.skills = user.profile.skills.filter(s => s !== skill);
    } else {
      // prevent duplicates
      if (!user.profile.skills.includes(skill)) user.profile.skills.push(skill);
    }

    await user.save();
    return res.json(user.profile.skills);
  } catch (err) {
    console.error('updateSkills error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile
  , addExperience
  , addEducation
  , updateSkills
}; 