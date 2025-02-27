const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const {connectConsumer} = require('./kafka');
app.use(express.json());
const {handleKafkaEvent} = require('./Processors/eventsProcessor');



const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Notification service running on port ${PORT}`);
  await connectConsumer(handleKafkaEvent); // Pass handler to Kafka consumer
});