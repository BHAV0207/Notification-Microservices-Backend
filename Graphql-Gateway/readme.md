# GraphQL Gateway

## Overview
This is a GraphQL Gateway that serves as a single entry point for multiple microservices in an e-commerce platform. It aggregates data from the following services:
- **User Service** (Manages user authentication and preferences)
- **Product Service** (Handles product-related data)
- **Order Service** (Manages orders and transactions)
- **Notification Service** (Handles user notifications)

The gateway is built using **Apollo Server** with **Express.js**, and it connects to the backend services via REST API calls.

---

## Features
- Centralized GraphQL API for multiple microservices
- Supports queries and mutations for users, products, orders, and notifications
- Authentication and authorization handled via JWT tokens
- Uses **Axios** for making requests to microservices
- Dockerized for easy deployment

---

## Technologies Used
- **Node.js**
- **Express.js**
- **Apollo Server**
- **GraphQL**
- **Axios**
- **Docker**

---

## Installation and Setup
### Prerequisites
- **Node.js v18+**
- **Docker (optional for containerized deployment)**

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/graphql-gateway.git
   cd graphql-gateway
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following variables:
   ```env
   PORT=7000
   USER_SERVICE_URL=http://user-service:8000
   PRODUCT_SERVICE_URL=http://product-service:8001
   ORDER_SERVICE_URL=http://order-service:8002
   NOTIFICATION_SERVICE_URL=http://notification-service:8003
   ```
4. Start the server:
   ```sh
   npm start
   ```
5. The GraphQL playground will be available at:
   ```
   http://localhost:7000/graphql
   ```

---

## Running with Docker
1. Build the Docker image:
   ```sh
   docker build -t graphql-gateway .
   ```
2. Run the container:
   ```sh
   docker run -p 7000:7000 --env-file .env graphql-gateway
   ```

---

## API Schema
### Queries
- `notifications(userId: String!): [Notification!]!`
- `unreadNotifications(userId: String!): [Notification!]!`
- `getUser(id: ID!): User`
- `getAllUsers: [User]`
- `getAllProducts: [Product]`
- `getProductById(id: ID!): Product`
- `getAllOrders: [Order]`
- `getOrderById(id: ID!): [Order!]!`

### Mutations
- `createNotification(userId: String!, userEmail: String!, type: String!, content: String!): Notification!`
- `markAsRead(notificationId: ID!): Notification!`
- `registerUser(name: String!, email: String!, password: String!, preferences: PreferencesInput!): User`
- `loginUser(email: String!, password: String!): AuthPayload`
- `updateUserPreferences(id: ID!, preferences: PreferencesInput!): User`
- `createProduct(name: String!, price: Float!, stock: Int!, category: String!, description: String!): Product`
- `updateProduct(id: ID!, name: String, price: Float, stock: Int, category: String, description: String): Product`
- `deleteProduct(id: ID!): String`
- `createOrder(userId: ID!, products: [ProductInOrderInput!]!): Order`
- `updateOrder(id: ID!, products: [ProductInOrderInput]): Order`
- `deleteOrder(id: ID!): String`

---

## Folder Structure
```
/graphql-gateway
│── graphql/
│   ├── schema.js       # GraphQL schema definitions
│   ├── resolver.js     # Resolver functions for GraphQL API
│── .env                # Environment variables
│── Dockerfile          # Docker setup
│── index.js            # Entry point (Express + Apollo Server)
│── package.json        # Dependencies and scripts
```

---

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-branch`)
5. Create a pull request

---

## License
This project is licensed under the **MIT License**.

---

## Contact
For any questions, feel free to reach out via GitHub issues or email at `your-email@example.com`.

