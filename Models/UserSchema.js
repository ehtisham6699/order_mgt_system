const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  contact: {
    type: Number,
  },
});

module.exports = mongoose.model("user", userSchema);
