const mongoose = require('mongoose');

const MultiImageSchema = new mongoose.Schema({
  properties: [String ],
},{timestamps:true,versionKey:false});

const MultiImage = mongoose.model('MultiImage', MultiImageSchema);

module.exports = MultiImage;