const express = require("express");
const redis = require("../redisClient");
const { producer, connectProducer } = require("../kafka");

connectProducer();
const productEvents = {}; // Store product events by category
let userPreferences = true;
let userEmail = "";
const handleKafkaEvent = async (topic, event) => {
  try {
    if (topic === "user_logged_in") {
      console.log(
        event.preferences.recommendations + "" + " sending preferences "
      );
      if (event.email) {
        userPreferences = event.preferences.recommendations;
        userEmail = event.email;
        console.log(`User ${userPreferences} logged in`);
      }
    } else if (topic === "user_orders") {
      console.log(`📦 Order event received for user: ${event.userId}`);

      // Extract categories from orders
      const categoryCount = {};
      event.orders.forEach((order) => {
        order.products.forEach((product) => {
          categoryCount[product.category] =
            (categoryCount[product.category] || 0) + 1;
        });
      });

      // Find most purchased category
      const topCategory = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
      );

      console.log(`📊 Most purchased category: ${topCategory}`);

      // Store the top category in Redis
      await redis.set(`user:${event.userId}:topCategory`, topCategory);

      // Check if any stored products match the top category
      if (userPreferences) {
        if (
          productEvents[topCategory] &&
          productEvents[topCategory].length > 0
        ) {
          const firstProduct = productEvents[topCategory][0]; // Get the first product only

          console.log(
            `🎯 Recommending stored product: ${firstProduct.name} to user ${event.userId}`
          );

          await producer.send({
            topic: "recommendation_email",
            messages: [
              {
                value: JSON.stringify({
                  email: userEmail,
                  userId: event.userId,
                  product: firstProduct.name,
                  category: firstProduct.category,
                }),
              },
            ],
          });

          console.log(
            `📩 Sent recommendation email event for user ${event.userId}`
          );
        }
      } else {
        console.log(`User ${event.userId} has disabled recommendations`);
      }
    } else if (topic === "product-events") {
      console.log(`📦 Product event received: ${JSON.stringify(event)}`);

      // Store product event in memory for later use
      if (!productEvents[event.category]) {
        productEvents[event.category] = [];
      }
      productEvents[event.category].push(event);

      console.log(`📂 Stored product event for category: ${event.category}`);

      // ✅ No Kafka event is fired from here
    }
  } catch (error) {
    console.error("❌ Error handling Kafka event:", error);
  }
};

module.exports = { handleKafkaEvent };
