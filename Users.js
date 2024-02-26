const mongoose = require("./Connect");

const UserSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("users", UserSchema);