const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');
const Comment = require('../models/comment');
const { deleteUploadedImage } = require('../utils/imageHelper');

// Get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create entry
router.post('/', async (req, res) => {
  const entry = new Entry(req.body);
  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update entry
router.put('/:id', async (req, res) => {
  try {
    // First get the existing entry to check if image changed
    const existingEntry = await Entry.findById(req.params.id);
    if (!existingEntry) return res.status(404).json({ message: 'Entry not found' });
    
    // If image URL changed and old one was an uploaded image, delete it
    if (existingEntry.imageUrl && 
        req.body.imageUrl && 
        existingEntry.imageUrl !== req.body.imageUrl &&
        existingEntry.imageUrl.includes('uploads/')) {
      deleteUploadedImage(existingEntry.imageUrl);
    }
    
    const updatedEntry = await Entry.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json(updatedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Delete entry (and associated image)
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    
    // Delete the entry's image if it's in our uploads folder
    if (entry.imageUrl) {
      deleteUploadedImage(entry.imageUrl);
    }
    
    // Delete the entry
    await Entry.findByIdAndDelete(req.params.id);
    
    // Delete associated comments
    await Comment.deleteMany({ entryId: req.params.id });
    
    res.json({ message: 'Entry and associated data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;