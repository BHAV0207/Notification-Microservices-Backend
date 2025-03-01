const express = require("express");
const router = express.Router();
const Product = require("../Models/productModels");
const {connectConsumer} = require("../kafka");
const { producer } = require("../kafka");
const redis = require("../redisClient");
const authMiddleware = require("../MiddleWare/authMiddleware");


connectConsumer("order_created", async (message) => {
  try {
    const orderData = JSON.parse(message);
    console.log(`Product Service: Received Order -`, orderData);

    for (const item of orderData.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();

          // Update stock in Redis
          await redis.set(`product:${item.productId}:stock`, product.stock);

          console.log(` Updated stock for product ${item.productId}: New stock is ${product.stock}`);
        } else {
          console.error(` Insufficient stock for product ${item.productId}`);
        }
      } else {
        console.error(` Product not found: ${item.productId}`);
      }
    }
  } catch (error) {
    console.error(" Error in Product Service (Kafka Consumer):", error.message);
  }
});


// ✅ Create a new product
router.post("/create",authMiddleware, async (req, res) => {
  const { name, price, stock, category, description } = req.body;
  try {
    const product = await Product.create({
      name,
      price,
      stock,
      category,
      description,
    });

    await producer.send({
      topic: "product-events",
      messages: [
        {
          value: JSON.stringify({
            productId: product._id,
            stock: product.stock,
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
          }),
        },
      ],
    });
    console.log(
      "new kafka event has been fired for product creation" + product );
    res.status(201).json({ message: "Product Created", product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get all products
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get a product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update a product by ID
router.put("/:id",authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, category, description }, // 🔹 Added category field
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product Updated", product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete a product by ID
router.delete("/:id", authMiddleware ,async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
