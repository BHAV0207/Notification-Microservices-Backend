const express = require("express");

const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connect = require("./utils/data_base");
connect();

app.use(express.json());

const orderRouter = require("./Router/orderRouter");
app.use("/order", orderRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);


