# User Service

## Overview
The **User Service** is a microservice responsible for managing user registration, authentication, and preferences. It supports JWT-based authentication, integrates with Kafka for event-driven communication, and uses Redis for caching user data.

## Features
- **User Registration & Authentication**: Secure user sign-up and login using bcrypt and JWT.
- **Kafka Event Integration**: Publishes events like user registration and login to Kafka for other services to consume.
- **Redis Caching**: Stores user data in Redis to enhance performance.
- **RESTful API**: Exposes endpoints for user management.
- **MongoDB Storage**: Stores user data in a NoSQL database.
- **Dockerized**: Easily deployable using Docker and Docker Compose.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Messaging**: Kafka (with Zookeeper)
- **Caching**: Redis
- **Authentication**: JWT, bcrypt
- **Containerization**: Docker

## Folder Structure
```
/user-service
│-- models/              # Mongoose schemas
│-- routes/              # Express.js routes
│-- middleware/          # Authentication middleware
│-- utils/               # Utility functions
│-- kafka/               # Kafka producer and consumer setup
│-- redisClient.js       # Redis connection
│-- server.js            # Main entry point
│-- Dockerfile           # Docker setup
│-- .env                 # Environment variables
```

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- MongoDB
- Redis
- Kafka (with Zookeeper)
- Docker (optional for containerized deployment)

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/BHAV0207/Notification-Microservices-Backend.git
   cd Notification-Microservices-Backend/user-service
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/userDB
   JWT_SECRET=your_secret_key
   REDIS_HOST=localhost
   REDIS_PORT=6379
   KAFKA_BROKER=kafka:9092
   ```

4. Start MongoDB and Redis services:
   ```sh
   mongod --dbpath /data/db &
   redis-server
   ```

5. Start the Kafka broker and Zookeeper:
   ```sh
   zookeeper-server-start.sh config/zookeeper.properties &
   kafka-server-start.sh config/server.properties &
   ```

6. Run the User Service:
   ```sh
   npm start
   ```

## Docker Setup
To run the service in a containerized environment:
1. Build the Docker image:
   ```sh
   docker build -t user-service .
   ```

2. Run the container:
   ```sh
   docker run -p 8000:8000 --env-file .env user-service
   ```

## API Endpoints
### Authentication
| Method | Endpoint        | Description         |
|--------|----------------|---------------------|
| POST   | `/user/register` | Register a new user |
| POST   | `/user/login`    | Authenticate user & get JWT |

### User Management
| Method | Endpoint       | Description         |
|--------|---------------|---------------------|
| GET    | `/user/all`    | Get all users       |
| GET    | `/user/:id`    | Get user by ID      |
| PUT    | `/user/:id`    | Update user info    |

## Kafka Events
The User Service publishes the following Kafka events:
- **`user_registered`**: Triggered when a new user registers.
- **`user_logged_in`**: Triggered when a user logs in.

## Redis Caching
- User data is cached for **24 hours** to optimize database queries.
- Cache is updated whenever a user logs in.

## Security & Best Practices
- Uses **bcrypt** to hash passwords before storing them.
- Implements **JWT authentication** for secure access.

