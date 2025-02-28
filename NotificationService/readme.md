# Notification Service

## Overview
The **Notification Service** is a microservice responsible for handling user notifications in an e-commerce platform. It listens to Kafka events, stores notifications in a MongoDB database, sends email notifications using Nodemailer, and supports scheduled promotional emails via cron jobs.

## Features
- ✅ **Kafka Event Processing:** Listens for events like user registration, login, order creation, and recommendations.
- ✅ **Redis Caching:** Stores user preferences and frequently accessed data.
- ✅ **MongoDB Storage:** Persists notifications for users.
- ✅ **Email Notifications:** Sends emails using Nodemailer.
- ✅ **REST API:** Provides endpoints to create, fetch, and update notifications.
- ✅ **Cron Jobs:** Sends periodic promotional emails.
- ✅ **Docker Support:** Easily deployable using Docker.

---

## Tech Stack
- **Node.js** (Express.js)
- **Kafka** (Kafkajs)
- **MongoDB** (Mongoose)
- **Redis** (ioredis)
- **Nodemailer** (for email notifications)
- **Docker** (Containerization)
- **Axios** (HTTP requests)
- **node-cron** (Scheduling tasks)

---

## Setup and Installation
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/notification-service.git
cd notification-service
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file and configure the following variables:
```env
PORT=8003
MONGO_URI=mongodb://mongo:27017/notifications
KAFKA_BROKER=kafka:9092
REDIS_HOST=redis
REDIS_PORT=6379
EMAIL=your-email@gmail.com
PASSWORD=your-email-password
USER_SERVICE_URL=http://user-service:8000
```

### 4️⃣ Run the Service
#### Development Mode
```sh
npm start
```
#### Docker
```sh
docker build -t notification-service .
docker run -p 8003:8003 notification-service
```

---

## API Endpoints

### 1️⃣ Create a Notification
```http
POST /notification/create
```
#### Request Body
```json
{
  "userId": "123",
  "userEmail": "user@example.com",
  "type": "order_created",
  "content": "Your order has been placed successfully."
}
```
#### Response
```json
{
  "message": "Notification stored & email sent",
  "notification": { "id": "...", "userId": "123", ... }
}
```

### 2️⃣ Get User Notifications
```http
GET /notification/:userId
```
#### Response
```json
[
  {
    "userId": "123",
    "content": "Your order has been placed successfully.",
    "read": false
  }
]
```

### 3️⃣ Mark Notification as Read
```http
PUT /notification/read/:notificationId
```
#### Response
```json
{
  "message": "Notification marked as read"
}
```

---

## Kafka Topics
| Topic | Description |
|--------|-------------|
| `user_registered` | Sends a welcome email upon user registration |
| `user_logged_in` | Notifies users of login events |
| `order_created` | Notifies users about their new orders |
| `recommendation_email` | Sends personalized product recommendations |

---

## Redis Caching
- **Stores user preferences and emails for quick access.**
- Uses `setex` for data expiration (24 hours).

---

## Cron Job (Promotional Emails)
- **Runs every 1 day** (`0 0 * * *`).
- Fetches all users and checks their promotional email preferences.
- Sends marketing emails to interested users.

---

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push the branch (`git push origin feature-branch`).
5. Create a Pull Request.

---
