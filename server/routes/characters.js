const express = require('express');
const router = express.Router();
const Character = require('../models/character');
const Comment = require('../models/comment');

// Get all characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one character
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ message: 'Character not found' });
    res.json(character);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create character
router.post('/', async (req, res) => {
  const character = new Character(req.body);
  try {
    const newCharacter = await character.save();
    res.status(201).json(newCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update character
router.put('/:id', async (req, res) => {
  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedCharacter) return res.status(404).json({ message: 'Character not found' });
    res.json(updatedCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete character (and associated comments)
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ message: 'Character not found' });
    
    // Delete all comments by this character
    await Comment.deleteMany({ characterId: req.params.id });
    
    // Delete the character
    await Character.findByIdAndDelete(req.params.id);
    res.json({ message: 'Character and associated comments deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;