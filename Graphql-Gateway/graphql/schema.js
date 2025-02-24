const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Notification {
    id: ID!
    userId: String!
    userEmail: String!
    type: String!
    content: String!
    sendAt: String!
    read: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    preferences: Preferences!
  }

  type Preferences {
    promotions: Boolean!
    order_updates: Boolean!
    recommendations: Boolean!
  }

  input PreferencesInput {
    promotions: Boolean!
    order_updates: Boolean!
    recommendations: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    category: String!
    description: String!
  }

  type ProductInOrder {
    productId: ID!
    quantity: Int!
  }

  type Order {
    id: ID!
    userId: ID!
    products: [ProductInOrder!]!
  }

  input ProductInOrderInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    notifications(userId: String!): [Notification!]!
    unreadNotifications(userId: String!): [Notification!]!

    getUser(id: ID!): User
    getAllUsers: [User]

    getAllProducts: [Product]
    getProductById(id: ID!): Product

    getAllOrders: [Order]
    getOrderById(id: ID!): Order
  }

  type Mutation {
    createNotification(
      userId: String!
      userEmail: String!
      type: String!
      content: String!
    ): Notification!

    markAsRead(notificationId: ID!): Notification!

    registerUser(
      name: String!
      email: String!
      password: String!
      preferences: PreferencesInput!
    ): User

    loginUser(email: String!, password: String!): AuthPayload

    updateUserPreferences(id: ID!, preferences: PreferencesInput!): User

    createProduct(
      name: String!
      price: Float!
      stock: Int!
      category: String!
      description: String!
    ): Product
    updateProduct(
      id: ID!
      name: String
      price: Float
      stock: Int
      category: String
      description: String
    ): Product
    deleteProduct(id: ID!): String

    createOrder(
      userId: ID!
      products: [ProductInOrderInput!]!
    ): Order
    updateOrder(
      id: ID!
      products: [ProductInOrderInput]
    ): Order
    deleteOrder(id: ID!): String
  }
`;

module.exports = typeDefs;