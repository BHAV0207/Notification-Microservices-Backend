  const { Kafka } = require("kafkajs");

  const kafka = new Kafka({
    clientId: "product-service",
    brokers: ["kafka:9092"],
  });

  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "product-service" });

  const connectProducer = async () => {
    await producer.connect();
    console.log("Connected to Kafka producer");
  };

  const connectConsumer = async (topic, handler) => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        console.log("received message", message.value.toString());
        handler(message.value.toString());
      },
    });
  };

  module.exports = { producer, connectProducer, connectConsumer };
