const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  title: {
    type: String,
  },
  quantity: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("order", orderSchema);
