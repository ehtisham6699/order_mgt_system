const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("product", productSchema);
