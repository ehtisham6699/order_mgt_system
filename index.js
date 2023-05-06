const mongoose = require("mongoose");
const Order = require("./OrderSchema");
const connectDB = require("./database");
exports.createOrder = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);

    const newOrder = await Order.create(requestBody);

    return {
      statusCode: 200,
      body: JSON.stringify(newOrder),
    };
  } catch (err) {
    console.error("Error creating Order:", err);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating Order" }),
    };
  }
};
