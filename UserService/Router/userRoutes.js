const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../MiddleWare/authMiddleware");
const { connectProducer, producer } = require("../kafka");

connectProducer();

const fireKafkaEvent = async (topic, data) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });

    console.log(`Kafka event fired to ${topic}:`, data);
  } catch (err) {
    console.error("Kafka event failed:", err);
  }
};

router.post("/register", async (req, res) => {
  const { name, email, password, preferences } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    preferences,
  });

  try {
    const savedUser = await user.save();

    await fireKafkaEvent("user_registered", {
      userId: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      preferences: savedUser.preferences,
      timestamp: new Date(),
    });

    res.json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, preferences: user.preferences },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await fireKafkaEvent("user_logged_in", {
      userId: user._id,
      email: user.email,
      preferences: user.preferences,
      timestamp: new Date(),
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "User updated", updatedUser });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
