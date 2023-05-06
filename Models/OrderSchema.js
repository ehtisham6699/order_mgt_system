const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [{ type: Schema.Types.ObjectId, ref: "product" }],
  customer: { type: Schema.Types.ObjectId, ref: "user" },
  address: {
    type: String,
  },
});

module.exports = mongoose.model("order", orderSchema);
