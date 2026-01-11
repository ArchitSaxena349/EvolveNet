const Group = require('../models/Group');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, tags, isPrivate } = req.body;

    // Create group
    const group = await Group.create({
      name,
      description,
      tags,
      isPrivate,
      creator: req.user.id,
      admins: [req.user.id],
      members: [req.user.id]
    });

    res.status(201).json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .populate('admins', 'name email')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   GET /api/groups/:id
// @desc    Get group by ID
// @access  Public
const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .populate('admins', 'name email');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   PUT /api/groups/:id
// @desc    Update group
// @access  Private
const updateGroup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, tags, isPrivate } = req.body;

    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is admin
    if (!group.isAdmin(req.user.id)) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    // Update group fields
    group.name = name || group.name;
    group.description = description || group.description;
    group.tags = tags || group.tags;
    group.isPrivate = isPrivate !== undefined ? isPrivate : group.isPrivate;

    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   DELETE /api/groups/:id
// @desc    Delete group
// @access  Private
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    await group.deleteOne();
    res.json({ message: 'Group removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   POST /api/groups/:id/join
// @desc    Join group
// @access  Private
const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is already a member
    if (group.isMember(req.user.id)) {
      return res.status(400).json({ error: 'User already a member of this group' });
    }

    // Add user to members
    group.members.push(req.user.id);
    await group.save();

    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

// @route   DELETE /api/groups/:id/leave
// @desc    Leave group
// @access  Private
const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is a member
    if (!group.isMember(req.user.id)) {
      return res.status(400).json({ error: 'User is not a member of this group' });
    }

    // Remove user from members and admins
    group.members = group.members.filter(
      member => member.toString() !== req.user.id
    );
    group.admins = group.admins.filter(
      admin => admin.toString() !== req.user.id
    );
    await group.save();

    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup
}; 