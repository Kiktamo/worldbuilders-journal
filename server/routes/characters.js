const express = require('express');
const router = express.Router();
const Character = require('../models/character');
const Comment = require('../models/comment');
const { deleteUploadedImage } = require('../utils/imageHelper');

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
    // First get the existing character to check if image changed
    const existingCharacter = await Character.findById(req.params.id);
    if (!existingCharacter) return res.status(404).json({ message: 'Character not found' });
    
    // If image URL changed and old one was an uploaded image, delete it
    if (existingCharacter.imageUrl && 
        req.body.imageUrl && 
        existingCharacter.imageUrl !== req.body.imageUrl &&
        existingCharacter.imageUrl.includes('uploads/')) {
      deleteUploadedImage(existingCharacter.imageUrl);
    }
    
    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json(updatedCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete character (and associated comments and image)
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ message: 'Character not found' });
    
    // Delete all comments by this character
    await Comment.deleteMany({ characterId: req.params.id });
    
    // Delete the character's image if it's in our uploads folder
    if (character.imageUrl) {
      deleteUploadedImage(character.imageUrl);
    }
    
    // Delete the character
    await Character.findByIdAndDelete(req.params.id);
    res.json({ message: 'Character and associated data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;