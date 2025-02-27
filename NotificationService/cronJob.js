const cron = require("node-cron");
const redis = require("./redisClient");
const sendMail = require("./mailer");
const axios = require("axios");

const USER_SERVICE_URL = "http://user-service:8000";

// 🔹 Fetch All Users (Prefers Redis, Falls Back to User Service)
const getAllUsers = async () => {
  try {
    let users = await redis.get("allUsers");

    // console.log("users............", users);
    if (!users) {
      console.log("Fetching users from User Service...");
      const response = await axios.get(`${USER_SERVICE_URL}/user/all`);
      users = response.data;

      await redis.setex("allUsers", 86400, JSON.stringify(users)); // Cache for 24 hours
    } else {
      users = JSON.parse(users);
    }

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// 🔹 Send Promotional Emails
const sendPromotionalEmails = async () => {
  console.log("🚀 Starting promotional email job...");

  const users = await getAllUsers();
  // console.log("users............", users);
  for (const user of users) {
    // console.log("user............", user);
    if (user.preferences?.promotions) {
      const emailContent = `
        Hello ${user.name},  
        We have exclusive offers just for you! Visit our store for amazing discounts.  
        Don't miss out on these limited-time deals!
      `;

      try {
        await sendMail(user.email, "Exclusive Promotions Just for You!", emailContent);
        console.log(`✅ Promotional email sent to ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${user.email}:`, error);
      }
    }
  }

  console.log("✅ Promotional email job completed.");
};

// 🔹 Schedule Cron Job (Runs Every 5 Minute)
cron.schedule("*/5 * * * *", async () => {
  await sendPromotionalEmails();
});

module.exports = { sendPromotionalEmails };
