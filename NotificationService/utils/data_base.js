const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to NotificationService Database");
  } catch (error) {
    console.log("Error connecting to NotificationService Database", error);
  }
};

module.exports = connect;