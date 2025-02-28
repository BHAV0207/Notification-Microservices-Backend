# Order Service

## Overview
The **Order Service** is responsible for handling order creation, retrieval, updates, and deletions. It integrates with Kafka for event-driven communication and Redis for caching product stock levels. Additionally, it listens for user login events to fetch order history and sends relevant notifications.

## Features
- Create, update, delete, and retrieve orders
- Publish order-related events to Kafka
- Consume product and user-related events
- Cache product stock in Redis for fast access

## Technologies Used
- **Node.js** (Express.js)
- **MongoDB** (Mongoose for ORM)
- **Kafka** (Kafkajs for event-driven communication)
- **Redis** (ioredis for caching)
- **Docker** (for containerization)
- **dotenv** (for environment variable management)

## API Endpoints

### 1. Create an Order
**Endpoint:** `POST /order/create`
- Creates a new order after verifying product stock and user preferences.

### 2. Get All Orders
**Endpoint:** `GET /order/all`
- Fetches all orders.

### 3. Get Orders by User ID
**Endpoint:** `GET /order/:id`
- Retrieves orders placed by a specific user and fires a Kafka event.

### 4. Update an Order
**Endpoint:** `PUT /order/:id`
- Updates an order by ID.

### 5. Delete an Order
**Endpoint:** `DELETE /order/:id`
- Deletes an order by ID.

## Kafka Integration

### Topics Published
- **`order_created`** → Fired when an order is placed (if user preferences allow notifications).
- **`user_orders`** → Sent when a user logs in to provide their past orders.

### Topics Consumed
- **`product_events`** → Updates stock levels in Redis.
- **`user_logged_in`** → Listens for user login events to fetch order history.

## Redis Caching
- Stores product stock for quick retrieval using keys: `product:{productId}:stock`
- Stores user preferences using keys: `user:preferences`
- Caches user email for notifications using keys: `user:email`

## Setup and Installation

### 1. Clone Repository
```sh
git clone <repo-url>
cd order-service
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Environment Variables
Create a `.env` file and configure:
```env
PORT=8002
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
docker build -t order-service .
docker run -p 8002:8002 order-service
```

## File Structure
```
order-service/
│── Models/
│   ├── orderModels.js  # Mongoose schema for Order
│
│── Router/
│   ├── orderRouter.js  # Order API routes and Kafka event handler
│
│── utils/
│   ├── data_base.js    # MongoDB connection setup
│
│── kafka.js            # Kafka producer and consumer setup
│── redisClient.js      # Redis configuration
│── server.js           # Main server file
│── Dockerfile          # Docker setup
│── .env                # Environment variables
│── package.json        # Dependencies
```

## Notes
- Ensure Kafka and Redis are running before starting the service.
- Orders are only created if product stock is available and user preferences allow notifications.
- The service listens for `user_logged_in` events to fetch order history automatically.

---
This **Order Service** plays a crucial role in handling e-commerce order management efficiently using event-driven architecture. 🚀

