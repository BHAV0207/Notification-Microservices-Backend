const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    promotions: {
      type: Boolean,
      required: true,
    },
    order_updates: {
      type: Boolean,
      required: true,
    },
    recommendations: {
      type: Boolean,
      required: true,
    },
  },
});


module.exports = mongoose.model("User", userSchema);