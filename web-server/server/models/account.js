const {mongoose} = require('../db/mongoose');

var accountSchema = new mongoose.Schema({
  email: String,
  password: String
});

var Account = mongoose.model('accounts',accountSchema);

module.exports = {Account};
