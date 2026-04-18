const express = require('express');
const Request = require('../models/Request');
const { protect } = require('../middleware/auth');
const { detectUrgency, detectCategory, suggestTags, generateSummary } = require('../utils/aiLogic');

const router = express.Router();

// @route   GET /api/requests
// @desc    Get all requests
router.get('/', async (req, res) => {
  try {
    const { category, urgency, status } = req.query;
    let query = {};
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;

    const requests = await Request.find(query)
      .populate('createdBy', 'name initials color')
      .sort({ createdAt: -1 });
    res.json(requests);
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

  try {
    // AI Simulation Logic
    const finalUrgency = urgency || detectUrgency(title + " " + description);
    const finalCategory = category || detectCategory(title + " " + description);
    const finalTags = tags ? tags.split(',').map(t => t.trim()) : suggestTags(title + " " + description);
    const aiSummary = generateSummary(title, description);

    const request = await Request.create({
      title,
      description,
      category: finalCategory,
      urgency: finalUrgency,
      tags: finalTags,
      createdBy: req.user._id,
      aiSummary
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/requests/:id
// @desc    Get single request
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('createdBy', 'name initials color trustScore')
      .populate('helpersInterested', 'name initials color');
    
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

    if (request) {
      if (request.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      request.status = 'Solved';
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/requests/:id/interest
// @desc    Express interest in a request
router.post('/:id/interest', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (request) {
      if (request.helpersInterested.includes(req.user._id)) {
        return res.status(400).json({ message: 'Already expressed interest' });
      }
      request.helpersInterested.push(req.user._id);
      await request.save();
      res.json({ message: 'Interest recorded' });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
