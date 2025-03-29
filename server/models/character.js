const { mongoose } = require("mongoose");

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    traits: [{ type: String }],
    imageUrl: { type: String, default: 'https://placeholder.com/150' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Character', characterSchema)