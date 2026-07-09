const User = require('../models/User');
const Token = require('../models/Token');
const Connection = require('../models/Connection');
const Event = require('../models/Event');
const Group = require('../models/Group');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const isValidImageSource = (value) =>
  typeof value === 'string' &&
  value.length <= 2500000 &&
  (value === '' ||
    /^data:image\/(?:jpeg|png|webp);base64,/i.test(value) ||
    /^https?:\/\//i.test(value));

const normalizeLegacyRole = (user) => {
  if (!['user', 'admin'].includes(user.role)) user.role = 'user';
};

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    // Delete user (Mongoose 7+ removed Document.remove())
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, bio, location, picture, coverPhoto } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (
      (picture !== undefined && !isValidImageSource(picture)) ||
      (coverPhoto !== undefined && !isValidImageSource(coverPhoto))
    ) {
      return res.status(400).json({ error: 'Invalid profile image data' });
    }

    // Profile updates revalidate unchanged fields, including roles from old versions.
    normalizeLegacyRole(user);

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.profile = user.profile || {};
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (picture !== undefined) user.profile.picture = picture;
    if (coverPhoto !== undefined) user.profile.coverPhoto = coverPhoto;

    if (password) {
      // Assign the plain password; the User pre-save hook hashes it.
      // Hashing here too would double-hash and break login.
      user.password = password;
    }

    await user.save();

    // Never return the password hash to the client
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Add experience to profile
// @route   PUT /api/users/profile/experience
// @access  Private
const addExperience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const exp = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    normalizeLegacyRole(user);

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const edu = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    normalizeLegacyRole(user);

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

const deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    normalizeLegacyRole(user);

    const experience = user.profile?.experience?.id(req.params.experienceId);
    if (!experience) return res.status(404).json({ error: 'Experience not found' });

    experience.deleteOne();
    await user.save();
    return res.json(user.profile.experience);
  } catch (err) {
    console.error('deleteExperience error:', err.message);
    return res.status(500).json({ error: 'Server Error' });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    normalizeLegacyRole(user);

    const education = user.profile?.education?.id(req.params.educationId);
    if (!education) return res.status(404).json({ error: 'Education not found' });

    education.deleteOne();
    await user.save();
    return res.json(user.profile.education);
  } catch (err) {
    console.error('deleteEducation error:', err.message);
    return res.status(500).json({ error: 'Server Error' });
  }
};

const clearProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    normalizeLegacyRole(user);

    user.profile = {
      bio: '',
      location: '',
      website: '',
      picture: '',
      coverPhoto: '',
      skills: [],
      experience: [],
      education: []
    };
    await user.save();
    return res.json(user);
  } catch (err) {
    console.error('clearProfile error:', err.message);
    return res.status(500).json({ error: 'Server Error' });
  }
};

const deleteOwnAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await Promise.all([
      Token.deleteMany({ user: userId }),
      Connection.deleteMany({ $or: [{ user: userId }, { connectedUser: userId }] }),
      Event.deleteMany({ organizer: userId }),
      Event.updateMany({ attendees: userId }, { $pull: { attendees: userId } }),
      Group.deleteMany({ creator: userId }),
      Group.updateMany(
        { $or: [{ members: userId }, { admins: userId }] },
        { $pull: { members: userId, admins: userId } }
      )
    ]);
    await user.deleteOne();
    return res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    console.error('deleteOwnAccount error:', err.message);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Add or remove skills
// @route   PUT /api/users/profile/skills
// @access  Private
const updateSkills = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { skill, action } = req.body;
    if (!skill) return res.status(400).json({ error: 'Skill is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    normalizeLegacyRole(user);

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
  , deleteExperience
  , deleteEducation
  , clearProfile
  , deleteOwnAccount
};
