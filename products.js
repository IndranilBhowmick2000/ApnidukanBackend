const mongoose= require("./Connect")

const ProductSchema= mongoose.Schema({
    title: String,
  imageURL: String,
  price: Number,
  rating: Number
})

module.exports = mongoose.model("products", ProductSchema);