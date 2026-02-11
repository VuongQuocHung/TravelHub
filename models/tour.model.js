const mongoose = require('mongoose');

module.exports.Tour = mongoose.model('Tour', {
  name: String,
  vehicle: String
}, 'tours');
