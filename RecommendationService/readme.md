# Recommendation Service

The **Recommendation Service** is responsible for providing personalized product recommendations based on user order history and preferences. It listens to relevant Kafka topics, processes user behavior data, and triggers recommendation emails accordingly.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Setup and Installation](#setup-and-installation)
- [Running the Service](#running-the-service)
- [Kafka Event Handling](#kafka-event-handling)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [License](#license)

## Features
- Listens to user login, product updates, and order events via Kafka.
- Stores user order history in Redis to determine the most purchased category.
- Recommends relevant products based on order history and stored product events.
- Sends recommendation events to a dedicated Kafka topic for email notifications.

## Architecture
The Recommendation Service subscribes to Kafka topics, processes incoming events, and interacts with Redis for storing and retrieving user order insights. If recommendations are enabled, it triggers email notifications via Kafka.

### Data Flow:
1. User logs in → Preferences are cached.
2. Order event received → Determines most purchased category → Stores in Redis.
3. Product event received → Stores products by category.
4. If user has recommendations enabled → Sends product recommendation to Kafka.

## Technologies Used
- **Node.js** (Express.js for server)
- **KafkaJS** (For event-driven communication)
- **Redis** (For caching user order insights)
- **Docker** (Containerized microservice)

## Environment Variables
The service uses the following environment variables, which should be configured in a `.env` file:

```ini
PORT=5000
KAFKA_BROKER=kafka:9092
REDIS_HOST=redis
REDIS_PORT=6379
```

## Setup and Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/recommendation-service.git
   cd recommendation-service
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the service:
   ```sh
   npm start
   ```

## Running the Service
To run the service using Docker:
```sh
docker build -t recommendation-service .
docker run -p 5000:5000 recommendation-service
```

## Kafka Event Handling
The service listens to the following Kafka topics:

| Topic            | Purpose |
|-----------------|---------|
| `user_logged_in` | Retrieves user preferences for recommendations. |
| `user_orders`    | Determines the most purchased category and stores it in Redis. |
| `product-events` | Stores product details by category for future recommendations. |

If recommendations are enabled, the service sends messages to:
- **Topic:** `recommendation_email`
- **Data Sent:** `{ email, userId, product, category }`

## API Endpoints
Currently, this service does not expose any REST API endpoints.

## Folder Structure
```plaintext
recommendation-service/
│── Processors/
│   ├── eventsProcessor.js          # Kafka event handling logic
│── redisClient.js                  # Redis client setup
│── kafka.js                        # Kafka producer and consumer setup
│── server.js                       # Main Express server
│── Dockerfile                      # Docker container setup
│── package.json                    # Dependencies and scripts
│── .env                            # Environment variables
```