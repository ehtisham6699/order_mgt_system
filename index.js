const Order = require("./Models/OrderSchema");
const Product = require("./Models/ProductSchema");
const User = require("./Models/UserSchema");
const connectDB = require("./database");
exports.createOrder = async (event, context) => {
  try {
    await connectDB();
    const requestBody = JSON.parse(event.body);

    const newOrder = await Order.create(requestBody);
    await processOrder(newOrder);
    return {
      statusCode: 200,
      body: JSON.stringify(newOrder),
    };
  } catch (err) {
    console.error("Error creating Order:", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
async function processOrder(order) {
  try {
    await connectDB();
    if (order.products.length > 0) {
      await Product.updateMany(
        { _id: { $in: order.products } },
        { soldOut: true },
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`${res.nModified} products updated`);
          }
        }
      ).exec();
    }
  } catch (err) {
    console.error("Error processing Order:", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
}
exports.getCustomerOrder = async (event, context) => {
  console.log(event);
  try {
    await connectDB();
    // find all orders for a specific user
    const orders = await Order.find({ customer: event.pathParameters._id });
    console.log("Orders:", orders);
    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (err) {
    console.error("Error fetching  all orders:", err);
    console.error("bodyyy:", JSON.parse(event));
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
