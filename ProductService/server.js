const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
const connect = require("./utils/data_base");
const productRouter = require("./Router/productRoutes");
app.use("/product", productRouter);
const Product = require("./Models/productModels");
const PORT = process.env.PORT || 5000;
const { producer, connectProducer } = require("./kafka");

const sendAllProductsToKafka = async () => {
  try {
    const products = await Product.find(); // Fetch products from DB

    // if (!products || products.length === 0) {
    //   console.log("⚠️ No products found to send to Kafka.");
    //   return; // Prevent sending an empty array
    // }

    // const messages = products.map((product) => ({
    //   value: JSON.stringify({ type: "all_products", product }),
    // }));

    // console.log("🛠 Debug Messages Array:", messages); // ✅ Log messages before sending

    // if (messages.length === 0) {
    //   console.error("❌ No valid messages to send to Kafka.");
    //   return;
    // }

    // await producer.send({
    //   topic: "product_events",
    //   messages, // ✅ Ensure this is not undefined
    // });

    for (const product of products) {
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
    }

    console.log("📤 All products sent to Kafka on startup.");
  } catch (error) {
    console.error("❌ Error sending products to Kafka:", error);
  }
};


app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connect();
  await connectProducer();
  await sendAllProductsToKafka();
});
