const express = require("express");
const app = express();
const { router, handleKafkaEvent } = require("./Router/notificationRoutes");
const { connectConsumer } = require("./kafka");
const cronJob = require("./cronJob");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const connect = require("./utils/data_base");
connect();

app.use("/notification", router);

cronJob.sendPromotionalEmails();

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Notification service running on port ${PORT}`);
  await connectConsumer(handleKafkaEvent); // Pass handler to Kafka consumer
});
