const express = require("express");
const sendMail = require("../mailer");
const Notification = require("../Models/notificationModel");
const redis = require("../redisClient");
const router = express.Router();

// Kafka Event Handler
const handleKafkaEvent = async (topic, event) => {
  try {
    let content = "";
    if (topic === "user_registered") {
      content = `Welcome ${event.name}! Your account has been successfully registered.`;

      const userPreferences = event.preferences || { order_updates: false };
      await redis.setex(
        `user:preferences`,
        86400,
        JSON.stringify(userPreferences)
      );
      await redis.setex(`user:email`, 86400, JSON.stringify(event.email));
    } 
    else if (topic === "user_logged_in") {
      content = `Hello ${event.email}, you just logged in. If this wasn't you, please secure your account.`;
      const userPreferences = event.preferences || { order_updates: false };
      await redis.setex(
        `user:preferences`,
        86400,
        JSON.stringify(userPreferences)
      );
      await redis.setex(`user:email`, 86400, JSON.stringify(event.email));
    } 
    else if (topic === "order_created") {
      content = `New order created with ID: ${event.orderId} by user ${event.userId}`;
    }
    else if(topic === "recommendation_email"){
      content = `We recommend you to try ${event.product} from ${event.category} category`;
    }


    if (content) {
      const notification = new Notification({
        userId: event.userId,
        userEmail: event.email,
        type: topic,
        content,
      });
      await notification.save();
      await sendMail(event.email, `New ${topic} Notification`, content);

      console.log(`Notification created & email sent for ${topic}`);
    }
  } catch (error) {
    console.error("Error handling Kafka event:", error);
  }
};

// Create Notification (API)
router.post("/create", async (req, res) => {
  try {
    const { userId, userEmail, type, content } = req.body;

    if (!userId || !userEmail || !type || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const notification = new Notification({ userId, userEmail, type, content });
    await notification.save();
    await sendMail(userEmail, `New ${type} Notification`, content);

    res
      .status(201)
      .json({ message: "Notification stored & email sent", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Notifications
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ sendAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});

// Get Unread Notifications
router.get("/unread/:userId", async (req, res) => {
  try {
    const unreadNotifications = await Notification.find({
      userId: req.params.userId,
      read: false,
    });
    res.json(unreadNotifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching unread notifications", error });
  }
});

// Mark Notification as Read
router.put("/read/:notificationId", async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
});

module.exports = { router, handleKafkaEvent };
