const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  title: String,
  description: String,
  date: String
});

//export our module to use in server.js
module.exports = mongoose.model("User", userSchema);
