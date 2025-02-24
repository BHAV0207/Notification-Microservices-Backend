const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "notification-service" });

const connectConsumer = async (handler) => {
  await consumer.connect();
  console.log("Connected to Kafka consumer");

  await consumer.subscribe({ topic: "user_registered", fromBeginning: true });
  await consumer.subscribe({ topic: "user_logged_in", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log(`Received event on topic ${topic}:`, event);
        await handler(topic, event); // Pass event to handler in notification routes
      } catch (error) {
        console.error("Error processing Kafka message:", error);
      }
    },
  });
};

module.exports = { connectConsumer };
