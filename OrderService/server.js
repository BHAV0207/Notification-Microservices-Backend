const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connect = require("./utils/data_base");
connect();
const Order = require("./Models/orderModels");
const { connectConsumer} = require("./kafka");
app.use(express.json());
const PORT = process.env.PORT || 5000;

const { router, handleKafkaEvent } = require("./Router/orderRouter");


app.use("/order", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectConsumer(handleKafkaEvent)
}
);


