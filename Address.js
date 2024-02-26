const mongoose = require("./Connect");

const AddressSchema = mongoose.Schema({
  fullName: String,
  phone: String,
  flat: String,
  city:String,
  state:String
});

module.exports = mongoose.model("Address", AddressSchema);