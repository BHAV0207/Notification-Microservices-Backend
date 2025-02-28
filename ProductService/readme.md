# Product Service

## Overview
The **Product Service** is responsible for managing product data, handling product-related operations, and publishing product events to Kafka. It provides RESTful APIs for CRUD operations on products and integrates with Redis for caching product stock levels.

## Features
- Create, update, delete, and retrieve products
- Publish product events to Kafka
- Consume order events to update product stock
- Store and retrieve stock levels using Redis for fast access

## Technologies Used
- **Node.js** (Express.js)
- **MongoDB** (Mongoose for ORM)
- **Kafka** (Kafkajs for event-driven communication)
- **Redis** (ioredis for caching)
- **Docker** (for containerization)
- **dotenv** (for environment variable management)

## API Endpoints

### Product Routes
- **POST `/product/create`** → Create a new product.
- **GET `/product/all`** → Retrieve all products.
- **GET `/product/:id`** → Get product details by ID.
- **PUT `/product/:id`** → Update product details by ID.
- **DELETE `/product/:id`** → Delete a product by ID.

## Kafka Integration

### Topics Published
- **`product-events`** → Fired when a new product is created or updated.

### Topics Consumed
- **`order_created`** → Listens for new orders and adjusts stock accordingly.

## Redis Caching
- Stores product stock for quick retrieval using keys: `product:{productId}:stock`

## File Structure
```
/product-service
│── /Router
│   ├── productRoutes.js      # Defines API routes for product management
│
│── /Models
│   ├── productModels.js      # Mongoose schema for product data
│
│── /utils
│   ├── data_base.js          # Database connection setup
│
│── /kafka 
│   ├── kafka.js              # Kafka producer and consumer setup
│
│─- redisClient.js            # Redis client configuration
│
│── .env                      # Environment variables
│── dockerfile                # Docker setup
│── package.json              # Dependencies and scripts
│── server.js                 # Main server entry point
```

## Setup and Installation

### 1. Clone Repository
```sh
git clone <repo-url>
cd product-service
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Environment Variables
Create a `.env` file and configure:
```env
PORT=8001
MONGO_URI=<your-mongodb-uri>
REDIS_HOST=redis
REDIS_PORT=6379
KAFKA_BROKER=kafka:9092
```

### 4. Run Service
```sh
npm start
```

## Docker Setup
To run the service inside a Docker container:
```sh
docker build -t product-service .
docker run -p 8001:8001 product-service
```

