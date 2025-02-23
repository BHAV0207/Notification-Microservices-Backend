const express = require("express");
const router = express.Router();
const Product = require("../Models/productModels");

// ✅ Create a new product
router.post("/create", async (req, res) => {
  const { name, price, stock, category, description } = req.body;
  try {
    const product = await Product.create({
      name,
      price,
      stock,
      category, // 🔹 Added category field
      description,
    });
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
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
