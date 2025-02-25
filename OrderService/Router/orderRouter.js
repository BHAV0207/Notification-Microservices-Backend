const express = require("express");
const router = express.Router();
const Order = require("../Models/orderModels");
const { producer, connectProducer } = require("../kafka");
const redis = require("../redisClient");

connectProducer();

router.post("/create", async (req, res) => {
  try {
    if (req.body.userId === undefined || req.body.products.length === 0) {
      res.status(400).json("Bad request");
      return;
    }

    const newOrder = new Order(req.body);
    await newOrder.save();

    console.log("New order created:", newOrder.userId);

    const cachedPreferences = await redis.get(`user:preferences`);
    const userEmail = await redis.get(`user:email`);
    console.log(JSON.parse(cachedPreferences));

    const userPreferences = JSON.parse(cachedPreferences);
    const user = JSON.parse(userEmail);

    if (userPreferences.order_updates) {
      await producer.send({
        topic: "order_created",
        messages: [{ value: JSON.stringify({
          orderId : newOrder._id,
          userId : newOrder.userId,
          email : user,
          products : newOrder.products,
        })
       }],
      });
      console.log("Kafka event order_created successfully sent " + newOrder._id  +" " + user + " " + newOrder.products); 
    }
    else{
      console.log("User has disabled order updates");
    }

    res.status(200).json({ message: "Order has been created", newOrder });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order === null) {
      res.status(404).json("Order not found");
      return;
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order === null) {
      res.status(404).json("Order not found");
      return;
    }
    await Order.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json({ message: "Order has been updated", order });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order === null) {
      res.status(404).json("Order not found");
      return;
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
