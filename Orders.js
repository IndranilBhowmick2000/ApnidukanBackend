const mongoose = require("./Connect");

const OrderSchema = mongoose.Schema({
  price: Number,
  products: Array,
  email: String,
  address: Object,
});

module.exports = mongoose.model("orders", OrderSchema);