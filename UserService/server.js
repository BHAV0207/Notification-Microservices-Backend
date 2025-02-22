const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const connect = require('./utils/data_base');
connect();

const userRoutes = require('./Router/userRoutes');
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running ON PORT: ' + PORT);
});