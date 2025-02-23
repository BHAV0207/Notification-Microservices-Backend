const axios = require("axios");
const { response } = require("express");

const USER_SERVICE_URL = "http://localhost:8000";
const PRODUCT_SERVICE_URL = "http://localhost:8001";
const ORDER_SERVICE_URL = "http://localhost:8002";
const NOTIFICATION_SERVICE_URL = "http://localhost:8003";

const resolver = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const res = await axios.get(`${USER_SERVICE_URL}/user/${id}`);
        const user = res.data;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
        };
      } catch (error) {
        throw new Error("user not found");
      }
    },

    getAllUsers: async () => {
      try {
        const res = await axios.get(`${USER_SERVICE_URL}/user/all`);
        const users = res.data;
        return users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
        }));
      } catch (error) {
        throw new Error("users not found");
      }
    },

    getAllProducts: async () => {
      try {
        console.log("getting...")
        const res = await axios.get(`${PRODUCT_SERVICE_URL}/product/all`);
      
        const products = res.data.products;
        return products.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          description: product.description,
        }));
      } catch (error) {
        throw new Error("Products not found");
      }
    },
    getProductById: async (_, { id }) => {
      try {
        const res = await axios.get(`${PRODUCT_SERVICE_URL}/product/${id}`);
        console.log(res.data);
        const product = res.data.product;
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          description: product.description,
        };
      } catch (error) {
        throw new Error("Product not found");
      }
    },

    getAllOrders: async () => {
      try {
        const res = await axios.get(`${ORDER_SERVICE_URL}/order/all`);
        const products = res.data;
        return products.map((order) => ({
          id: order._id,
          userId: order.userId,
          products: order.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        }));
      } catch (error) {
        throw new Error("Orders not found");
      }
    },
    getOrderById: async (_, { id }) => {
      try {
        const res = await axios.get(`${ORDER_SERVICE_URL}/order/${id}`);
        const product = res.data;
        return {
          id: product._id,
          userId: product.userId,
          products: product.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        };
      } catch (error) {
        throw new Error("Order not found");
      }
    },

    notifications: async (_, { userId }) => {
      try {
        const res = await axios.get(
          `${NOTIFICATION_SERVICE_URL}/notification/${userId}`
        );
        const noti = res.data;

        return noti.map((notification) => ({
          id: notification._id,
          userId: notification.userId,
          userEmail: notification.userEmail,
          type: notification.type,
          content: notification.content,
          sendAt: notification.sendAt,
          read: notification.read,
        }));
      } catch (error) {
        throw new Error("Notifications not found");
      }
    },
    unreadNotifications: async (_, { userId }) => {
      try {
        const res = await axios.get(
          `${NOTIFICATION_SERVICE_URL}/notification/unread/${userId}`
        );
        const noti = res.data;
        return noti.map((notification) => ({
          id: notification._id,
          userId: notification.userId,
          userEmail: notification.userEmail,
          type: notification.type,
          content: notification.content,
          sendAt: notification.sendAt,
          read: notification.read,
        }));
      } catch (error) {
        throw new Error("Unread notifications not found");
      }
    },
  },

  Mutation: {
    registerUser: async (_, { name, email, password, preferences }) => {
      try {
        const res = await axios.post(`${USER_SERVICE_URL}/user/register`, {
          name,
          email,
          password,
          preferences,
        });
        return {
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          preferences: res.data.preferences,
        };
      } catch (error) {
        throw new Error("User registration failed");
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const res = await axios.post(`${USER_SERVICE_URL}/user/login`, {
          email,
          password,
        });
        const data = res.data;

        return {
          token: data.token,
        };
      } catch (error) {
        throw new Error("Login failed");
      }
    },
    updateUserPreferences: async (_, { id, preferences }) => {
      try {
        console.log("Updating preferences...");
        const res = await axios.put(`${USER_SERVICE_URL}/user/${id}`, {
          preferences,
        });

        return {
          id: res.data.updatedUser._id,
          name: res.data.updatedUser.name, 
          email: res.data.updatedUser.email,
          preferences: res.data.updatedUser.preferences,
        };

      } catch (error) {
        console.error(
          "Error updating preferences:",
          error.response?.data || error.message
        );
        throw new Error("Failed to update preferences");
      }
    },

    createProduct: async (_, { name, price, stock, category, description }) => {
      try {
        const res = await axios.post(`${PRODUCT_SERVICE_URL}/product/create`, {
          name,
          price,
          stock,
          category,
          description,
        });
        return {
          id: res.data.product._id,
          name: res.data.product.name,
          price: res.data.product.price,
          stock: res.data.product.stock,
          category: res.data.product.category,
          description: res.data.product.description,
        }
      } catch (error) {
        throw new Error("Product creation failed");
      }
    },
    updateProduct: async (
      _,
      { id, name, price, stock, category, description }
    ) => {
      try {
        const res = await axios.put(`${PRODUCT_SERVICE_URL}/product/${id}`, {
          name,
          price,
          stock,
          category,
          description,
        });
        return {
          id: res.data.product._id,
          name: res.data.product.name,
          price: res.data.product.price,
          stock: res.data.product.stock,
          category: res.data.product.category,
          description: res.data.product.description,
        }
      } catch (error) {
        throw new Error("Product update failed");
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        await axios.delete(`${PRODUCT_SERVICE_URL}/product/${id}`);
        return "Product deleted successfully";
      } catch (error) {
        throw new Error("Failed to delete product");
      }
    },

    createOrder: async (_, { userId, products }) => {
      try {
        const res = await axios.post(`${ORDER_SERVICE_URL}/order/create`, {
          userId,
          products,
        });

        return {
          id: res.data.newOrder._id,
          userId: res.data.newOrder.userId,
          products: res.data.newOrder.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        }
      } catch (error) {
        throw new Error("Order creation failed");
      }
    },
    updateOrder: async (_, { id, products }) => {
      try {
        const res = await axios.put(`${ORDER_SERVICE_URL}/order/${id}`, {
          products,
        });
        console.log(res.data);  
        return {
          id: res.data.order._id,
          userId: res.data.order.userId,
          products: res.data.order.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        };
      } catch (error) {
        throw new Error("Order update failed");
      }
    },
    deleteOrder: async (_, { id }) => {
      try {
        await axios.delete(`${ORDER_SERVICE_URL}/orders/${id}`);
        return "Order deleted successfully";
      } catch (error) {
        throw new Error("Failed to delete order");
      }
    },

    createNotification: async (_, { userId, userEmail, type, content }) => {
      try {
        console.log("Creating notification...");


        const res = await axios.post(
          `${NOTIFICATION_SERVICE_URL}/notification/create`,
          {
            userId,
            userEmail,
            type,
            content,
          }
        );
        console.log(res.data);
        return {
          id: res.data.notification._id,
          userId: res.data.notification.userId,
          userEmail: res.data.notification.userEmail,
          type: res.data.notification.type,
          content: res.data.notification.content,
          sendAt: res.data.notification.sendAt,
          read: res.data.notification.read,
        }
      } catch (error) {
        throw new Error("Notification creation failed");
      }
    },
    markAsRead: async (_, { notificationId }) => {
      try {
        const res = await axios.put(
          `${NOTIFICATION_SERVICE_URL}/notification/read/${notificationId}`
        );
        return res.data;
      } catch (error) {
        throw new Error("Failed to mark notification as read");
      }
    },
  },
};

module.exports = resolver;
