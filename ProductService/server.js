const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const connect = require("./utils/data_base");
connect();

const productRouter = require("./Router/productRoutes");
app.use("/product", productRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);
