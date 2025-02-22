const express = require("express");
const router = express.Router();
const Product = require("../Models/productModels");

router.post("/create", async (req, res) => {
  const { name, price, stock, description } = req.body;
  try {
    const product = await Product.create({
      name,
      price,
      stock,
      description,
    });
    res.status(201).json({ message: "Product Created", product });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, description },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product Updated", product });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
