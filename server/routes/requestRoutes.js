const express = require('express');
const mongoose = require('mongoose');
const Request = require('../models/Request');
const { protect } = require('../middleware/auth');
const { detectUrgency, detectCategory, suggestTags, generateSummary } = require('../utils/aiLogic');

const router = express.Router();

// @route   GET /api/requests
// @desc    Get all requests (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, urgency, status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(query)
      .populate('createdBy', 'name initials color location')
      .select('title description category urgency status tags createdBy helpersInterested createdAt aiSummary')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(requests);
  } catch (error) {
    console.error('GET /api/requests error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/requests/stats
// @desc    Get aggregate stats (lightweight)
router.get('/stats', async (req, res) => {
  try {
    const [total, open, solved] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: 'Open' }),
      Request.countDocuments({ status: 'Solved' }),
    ]);
    res.json({ total, open, solved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/requests/me
// @desc    Get current user's requests
router.get('/me', protect, async (req, res) => {
  try {
    const requests = await Request.find({ createdBy: req.user._id })
      .populate('createdBy', 'name initials color')
      .select('title description category urgency status tags createdBy helpersInterested createdAt')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/requests
// @desc    Create a new request
router.post('/', protect, async (req, res) => {
  const { title, description, category, urgency, tags } = req.body;

  // Input validation
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Title is required (min 3 characters)' });
  }

  try {
    const desc = description || 'No description provided.';
    // AI Simulation Logic
    const finalUrgency = urgency || detectUrgency(title + " " + desc);
    const finalCategory = category || detectCategory(title + " " + desc);

    let finalTags = [];
    if (tags && typeof tags === 'string') {
      finalTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      finalTags = tags;
    } else {
      finalTags = suggestTags(title + " " + desc);
    }

    const aiSummary = generateSummary(title, desc);

    const request = await Request.create({
      title: title.trim(),
      description: desc,
      category: finalCategory,
      urgency: finalUrgency,
      tags: finalTags,
      createdBy: req.user._id,
      aiSummary
    });

    // Populate createdBy before returning
    await request.populate('createdBy', 'name initials color');

    res.status(201).json(request);
  } catch (error) {
    console.error('POST /api/requests error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/requests/:id
// @desc    Get single request
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const request = await Request.findById(req.params.id)
      .populate('createdBy', 'name initials color trustScore location')
      .populate('helpersInterested', 'name initials color skills trustScore');
    
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/requests/:id/solve
// @desc    Mark request as solved
router.put('/:id/solve', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (request.status !== 'Solved') {
      request.status = 'Solved';
      await request.save();

      // Increment helper stats
      const User = require('../models/User');
      if (request.helpersInterested && request.helpersInterested.length > 0) {
        await User.updateMany(
          { _id: { $in: request.helpersInterested } },
          { $inc: { trustScore: 5, contributions: 1 } }
        );
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/requests/:id/help
// @desc    Express interest in helping a request
router.post('/:id/help', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot offer help on your own request' });
    }

    const alreadyHelping = request.helpersInterested.some(
      (id) => id.toString() === req.user._id.toString()
    );
    if (alreadyHelping) {
      return res.status(400).json({ message: 'Already expressed interest' });
    }

    request.helpersInterested.push(req.user._id);
    await request.save();

    const User = require('../models/User');
    const helper = await User.findById(req.user._id).select('name initials color skills trustScore');

    res.json({ message: 'Interest recorded', helper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
