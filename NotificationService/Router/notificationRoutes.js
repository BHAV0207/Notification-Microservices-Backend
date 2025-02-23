const express = require("express");
const router = express.Router();

const sendMail = require("../mailer");
const Notification = require("../Models/notificationModel");

router.post("/create", async (req, res) => {
  try {
    const { userId, userEmail, type, content } = req.body;


    if (!userId || !userEmail || !type || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const notification = new Notification({ userId, userEmail, type, content });
    await notification.save();

    await sendMail(userEmail, `New ${type} Notification`, content);

    res.status(201).json({ message: "Notification stored & email sent", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ sendAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});

router.get("/unread/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const unreadNotifications = await Notification.find({ userId, read: false });
    res.json(unreadNotifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread notifications", error });
  }
});


router.put("/read/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification: updatedNotification });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
});

module.exports = router;
