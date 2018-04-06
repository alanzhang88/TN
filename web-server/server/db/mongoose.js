const mongoose = require('mongoose');
const { mongoURI } = require('../config/config');

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI);

module.exports = {mongoose};
