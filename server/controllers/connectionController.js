const Connection = require('../models/Connection');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get user connections
// @route   GET /api/connections
// @access  Private
const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { user: req.user.id },
        { connectedUser: req.user.id }
      ],
      status: 'accepted'
    })
      .populate('user', 'name email')
      .populate('connectedUser', 'name email')
      .sort({ createdAt: -1 });

    res.json(connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get connection requests
// @route   GET /api/connections/requests
// @access  Private
const getConnectionRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      connectedUser: req.user.id,
      status: 'pending'
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Send connection request
// @route   POST /api/connections/:userId
// @access  Private
const sendConnectionRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { user: req.user.id, connectedUser: req.params.userId },
        { user: req.params.userId, connectedUser: req.user.id }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ error: 'Connection already exists' });
    }

    // Create connection request
    const connection = await Connection.create({
      user: req.user.id,
      connectedUser: req.params.userId,
      status: 'pending'
    });

    res.status(201).json(connection);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Accept connection request
// @route   PUT /api/connections/:id/accept
// @access  Private
const acceptConnectionRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Check if user is the recipient
    if (connection.connectedUser.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    // Update connection status
    connection.status = 'accepted';
    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Reject connection request
// @route   PUT /api/connections/:id/reject
// @access  Private
const rejectConnectionRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Check if user is the recipient
    if (connection.connectedUser.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    // Update connection status
    connection.status = 'rejected';
    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Remove connection
// @route   DELETE /api/connections/:id
// @access  Private
const removeConnection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Check if user is part of the connection
    if (
      connection.user.toString() !== req.user.id &&
      connection.connectedUser.toString() !== req.user.id
    ) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    await connection.deleteOne();
    res.json({ message: 'Connection removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getConnections,
  getConnectionRequests,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection
}; 