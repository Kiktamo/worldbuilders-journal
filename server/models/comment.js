const { mongoose } = require("mongoose");

const commentSchema = new mongoose.Schema({
    entryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry', required: true },
    characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Comment', commentSchema)