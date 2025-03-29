const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Character = require('../models/character');

// Get all comments (primarily for admin/stats purposes)
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comments by entry
router.get('/entry/:entryId', async (req, res) => {
  try {
    const comments = await Comment.find({ entryId: req.params.entryId });
    
    // Get character details for each comment
    const commentsWithCharacters = await Promise.all(comments.map(async (comment) => {
      const character = await Character.findById(comment.characterId);
      return {
        ...comment._doc,
        characterName: character ? character.name : 'Unknown Character'
      };
    }));
    
    res.json(commentsWithCharacters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comment count (efficient way to get just the count for stats)
router.get('/count', async (req, res) => {
  try {
    const count = await Comment.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create comment
router.post('/', async (req, res) => {
  // Validate that character exists
  try {
    const character = await Character.findById(req.body.characterId);
    if (!character) {
      return res.status(400).json({ message: 'Character not found' });
    }

    const comment = new Comment(req.body);
    const newComment = await comment.save();
    
    // Return comment with character name
    res.status(201).json({
      ...newComment._doc,
      characterName: character.name
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update comment
router.put('/:id', async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });
    
    // Get character name
    const character = await Character.findById(updatedComment.characterId);
    
    res.json({
      ...updatedComment._doc,
      characterName: character ? character.name : 'Unknown Character'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;