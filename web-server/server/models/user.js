const {mongoose} = require('../db/mongoose');

var UserSchema = new mongoose.Schema({
  source: String,
  userId: String,
  email: String,
  preference: [Number]
});

var User = mongoose.model("users",UserSchema);

module.exports = {User};
