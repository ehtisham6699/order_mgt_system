const mongoose = require("mongoose");

let conn = null;

const uri =
  "mongodb+srv://ehtisham:Fb37db99@cluster0.rdxfcfc.mongodb.net/?retryWrites=true&w=majority";
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
