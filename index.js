const Order = require("./Models/OrderSchema");
const Product = require("./Models/ProductSchema");
const User = require("./Models/UserSchema");
const connectDB = require("./database");
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({ region: "us-east-1" });
const mongoose = require("mongoose");
const OrderQueueUrl =
  "https://sqs.us-east-1.amazonaws.com/960964000470/order-msg";
const productQueueUrl =
  "https://sqs.us-east-1.amazonaws.com/960964000470/product-msg";

exports.createOrder = async (event, context) => {
  console.log(event);
  try {
    await connectDB();

    // Extract customer id and products array from request body

    const processOrderMessage = {
      products: event.products,
      customer: event.customer,
      address: event.address,
    };
    let msg = await sqs
      .sendMessage({
        QueueUrl: OrderQueueUrl,
        MessageBody: JSON.stringify(processOrderMessage),
      })
      .promise();
    console.log(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order created successfully" }),
    };
  } catch (err) {
    console.error("Error creating order:", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

// Function to process an order
exports.processOrder = async (event) => {
  await connectDB();
  const processOrderMessage = JSON.parse(
    event.Records[0].body.event
      ? event.Records[0].body.event
      : event.Records[0].body
  );
  console.log(
    processOrderMessage.event ? processOrderMessage.event : processOrderMessage
  );
  const data = processOrderMessage.event
    ? processOrderMessage.event
    : processOrderMessage;
  const newOrder = new Order(data);
  const result = await newOrder.save({ maxTimeMS: 30000 });
  // Process the order and update product info
  const updateProductInfoMessage = newOrder;

  await sqs
    .sendMessage({
      QueueUrl: productQueueUrl,
      MessageBody: JSON.stringify(updateProductInfoMessage),
    })
    .promise();
};

exports.updateProductInfo = async (event, context) => {
  try {
    await connectDB();
    const updateProductInfoMessage = JSON.parse(event.Records[0].body);
    console.log(updateProductInfoMessage.products.length);
    const newOrder = updateProductInfoMessage;

    // Update the product information
    if (newOrder.products.length > 0) {
      for (let i = 0; i < newOrder.products.length; i++) {
        const productId = newOrder.products[i];
        await Product.findByIdAndUpdate(
          productId,
          {
            $set: { soldOut: true },
          },
          { new: true }
        );
      }
    }
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};

exports.getCustomerOrder = async (event, context) => {
  console.log(event);
  try {
    await connectDB();
    // find all orders for a specific user
    const orders = await Order.find({ customer: event.pathParameters._id })
      .populate("customer")
      .populate("products");
    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (err) {
    console.error("Error fetching  all orders:", err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
exports.createUser = async (event, context) => {
  try {
    await connectDB();
    const requestBody = JSON.parse(event.body);

    const newUser = await User.create(requestBody);
    return {
      statusCode: 200,
      body: JSON.stringify(newUser),
    };
  } catch (err) {
    console.error("Error creating User:", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
