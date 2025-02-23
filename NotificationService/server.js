const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
const connect = require("./utils/data_base");
connect();


const notificationRoutes = require("./Router/notificationRoutes");
app.use("/notification", notificationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`NotificationService is running on port ${process.env.PORT}`);
});
