# 🛒 E-Commerce Notification Microservices Project

This is a **Personalized Notification System** for an **E-Commerce Platform**, built using a **microservices architecture**. The system ensures **personalized recommendations**, **order updates**, **promotional notifications**, and more, using **RabbitMQ/Kafka, GraphQL, JWT authentication, and Redis caching**.

## Architecture
![Screenshot from 2025-02-28 20-37-00](https://github.com/user-attachments/assets/df147ee8-b558-4ad1-a05f-91b97affaa0d)



## 📌 Features
- **User Service**: Handles user registration, authentication, and preference management.
- **Product Service**: Manages product inventory and availability.
- **Order Service**: Handles order placement, updates, and deletions.
- **Notification Service**: Sends personalized notifications based on user preferences.
- **Recommendation Service**: Recommends products based on order history.
- **GraphQL API Gateway**: Unifies all services with a single endpoint.
- **Asynchronous Communication**: Uses Kafka/RabbitMQ for inter-service messaging.
- **Scheduled Notifications**: Implements cron jobs for periodic notifications.
- **Caching with Redis**: Stores user preferences for fast access.
- **Containerized with Docker**: Deployable using Docker Compose.

## 🏗 Tech Stack
- **Backend**: Node.js, Express.js, Apollo Server (GraphQL)
- **Database**: MongoDB
- **Messaging**: RabbitMQ / Kafka
- **Authentication**: JWT
- **Caching**: Redis
- **Containerization**: Docker & Docker Compose

---

## 📂 Microservices Overview

### 1️⃣ User Service
- **Manages user authentication, registration, and preferences**.
- **Stores user data in MongoDB**.
- **Provides API endpoints for user management**.

### 2️⃣ Product Service
- **Handles product creation, updates, and stock management**.
- **Communicates with Order Service before processing orders**.

### 3️⃣ Order Service
- **Processes orders and checks product availability**.
- **Interacts with Redis to fetch user notification preferences**.
- **Sends order events to Kafka for notification processing**.

### 4️⃣ Notification Service
- **Listens to Kafka events and sends notifications**.
- **Supports email notifications using Nodemailer**.
- **Stores notification history in MongoDB**.

### 5️⃣ Recommendation Service
- **Analyzes order history and suggests relevant products**.
- **Processes data asynchronously and updates recommendations**.

### 6️⃣ GraphQL API Gateway
- **Acts as a unified interface for all services**.
- **Resolves queries using RESTful endpoints**.
- **Provides a single GraphQL endpoint for frontend interaction**.

---

## 🚀 Getting Started

### 🔹 Prerequisites
- **Docker & Docker Compose**
- **Node.js (v18+)**
- **MongoDB**
- **Kafka or RabbitMQ**
- **Redis**

### 🔹 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ecommerce-microservices.git
   cd ecommerce-microservices
   ```

2. Create a **.env** file in each microservice directory and configure environment variables.

3. Start the services using Docker Compose:
   ```sh
   docker-compose up --build
   ```

---

## 📌 API Endpoints

### 🔹 User Service
| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | `/user/register`     | Register a new user   |
| POST   | `/user/login`        | Authenticate user     |
| PUT    | `/user/:id`          | Update preferences    |

### 🔹 Product Service
| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| GET    | `/product/all`       | Get all products      |
| GET    | `/product/:id`       | Get product by ID     |
| POST   | `/product/create`    | Add a new product     |

### 🔹 Order Service
| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | `/order/create`      | Create a new order    |
| GET    | `/order/:id`         | Get order by ID       |
| DELETE | `/order/:id`         | Delete an order       |

### 🔹 Notification Service
| Method | Endpoint                      | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | `/notification/:userId`       | Get user notifications        |
| POST   | `/notification/create`        | Create a new notification     |

---

## 🔥 Deployment
To deploy the microservices using Docker:
```sh
 docker-compose up --build
```

This command builds all microservices and starts them in containers.

---
