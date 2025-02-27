const express = require("express");
const router = express.Router();
const Order = require("../Models/orderModels");
const { producer, connectProducer} = require("../kafka");
const redis = require("../redisClient");

connectProducer();

const handleKafkaEvent = async (topic, event) => {
  try{
    if(topic === "product_events"){

      const { stock, productId } = event;

      await redis.set(`product:${productId}:stock`, stock);
      console.log(
        `Order Service: Stored product ${productId} with stock ${stock} in Redis`
      );
    }
    else if(topic === "user_logged_in"){
      try {

        console.log("📩 Received user_logged_in event in the order service ");
        console.log(event);
        // console.log(JSON.parse(event));
        const userId = event.userId;
    
        console.log(`📩 Received login event for user: ${userId}`);
    
        if (!userId) {
          console.log("❌ Missing userId in event.");
          return;
        }
  
        const userOrders = await Order.find({ userId });
        console.log(userOrders);
    
        if (userOrders.length === 0) {
          console.log(`🛑 No orders found for user ${userId}.`);
          return;
        }
    
        await producer.send({
          topic: "user_orders",
          messages: [{ value: JSON.stringify({ userId, orders: userOrders }) }],
        });
    
        console.log(`✅ Orders for user ${userId} sent to Kafka`);
      } catch (err) {
        console.error("❌ Error processing user_logged_in event:", err);
      }
    }
  }catch(err){
    console.log(err);
  }
}

router.post("/create", async (req, res) => {
  try {
    if (req.body.userId === undefined || req.body.products.length === 0) {
      res.status(400).json("Bad request");
      return;
    }

    //     console.log("Creating new order............................");
    // //
    //     for (const item of req.body.products) {
    //       console.log(item);
    //       console.log("stock....")
    //       const stock = await redis.get(`product:${item.productId}:stock`);
    //       console.log(stock);

    //       if (stock === null) {
    //         return res
    //           .status(400)
    //           .json({ message: `Product ${item.productId} not found` });
    //       }

    //       if (parseInt(stock) < item.quantity) {
    //         return res
    //           .status(400)
    //           .json({ message: `Not enough stock for product ${item.productId}` });
    //       }
    //     }

    //     for (const item of req.body.products) {
    //       const stock = await redis.get(`product:${item.productId}:stock`);
    //       const newStock = parseInt(stock) - item.quantity;
    //       await redis.set(`product:${item.productId}:stock`, newStock);
    // }
    //
    const newOrder = new Order(req.body);
    await newOrder.save();

    console.log("New order created:", newOrder.userId);
    //
    // await redis.setEx(`order:${newOrder._id}`, 300, JSON.stringify(newOrder));
    // await redis.del("allOrders");
    //

    const cachedPreferences = await redis.get(`user:preferences`);
    const userEmail = await redis.get(`user:email`);
    console.log(JSON.parse(cachedPreferences));

    const userPreferences = JSON.parse(cachedPreferences);
    const user = JSON.parse(userEmail);

    if (userPreferences.order_updates) {
      await producer.send({
        topic: "order_created",
        messages: [
          {
            value: JSON.stringify({
              orderId: newOrder._id,
              userId: newOrder.userId,
              email: user,
              products: newOrder.products,
            }),
          },
        ],
      });

      console.log("order created");
    } else {
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
    const { id } = req.params;

    // Find all orders by userId
    const ordersByUserId = await Order.find({ userId: id });

    console.log(`🔍 Found ${ordersByUserId} orders for user ${id}`);

    if (ordersByUserId.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Fire Kafka event with all user orders
    await producer.send({
      topic: "user_orders",
      messages: [
        {
          value: JSON.stringify({
            userId: id,
            orders: ordersByUserId,
          }),
        },
      ],
    });

    console.log(`📢 Fired Kafka event: user_orders for user ${id}`);

    res.status(200).json(ordersByUserId);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
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

module.exports = {router, handleKafkaEvent};
