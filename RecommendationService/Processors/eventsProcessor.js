const express = require("express");
const redis = require("../redisClient");

const handleKafkaEvent = async (topic, event) => {
  try{
    if(topic = "user_logged_in"){
      console.log(`User ${event.email} logged in`);
    }
    else if(topic = "product_events"){
      console.log(`Product event: ${event}`);
    }
    else if(topic = "order_events"){
      console.log(`Order event: ${event}`);
    }
  }
  catch(error){
    console.error("Error handling Kafka event:", error);
  } 
}


module.exports = { handleKafkaEvent };
