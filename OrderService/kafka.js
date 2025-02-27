const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-service" });

const connectProducer = async () => {
  await producer.connect();
  console.log("Connected to Kafka producer");
};

const connectConsumer = async (handler) => {
  await consumer.connect();
  await consumer.subscribe({ topic : "product_events" , fromBeginning: true });
  await consumer.subscribe({ topic : "user_logged_in" , fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log(`📩 Received event on topic ${topic}:`, event);
        await handler(topic, event); // Pass event to handler
      } catch (error) {
        console.error("❌ Error processing Kafka message:", error);
      }
    },
  });
};

module.exports = {producer, connectProducer, connectConsumer};