const Order = require("./Models/OrderSchema");
const Product = require("./Models/ProductSchema");
const User = require("./Models/UserSchema");
const connectDB = require("./database");
exports.createOrder = async (event, context) => {
  console.log(event);
  try {
    await connectDB();

    // Extract customer id and products array from request body
    const { customer, products, address } = JSON.parse(event);

    // Create a new order object
    const newOrder = await new Order({
      customer: customer,
      products: products.map((productId) => ({ product: productId })),
      address: address,
    }).save();
    console.log(newOrder);
    // Process the order and update product info
    await processOrder(newOrder);

    return {
      statusCode: 200,
      body: JSON.stringify(newOrder),
    };
  } catch (err) {
    console.error("Error creating order:", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

// Function to process an order and update product info
async function processOrder(order) {
  // Loop through the products in the order
  if (order.products.length > 0) {
    for (let i = 0; i < order.products.length; i++) {
      const productId = order.products[i].product;

      // Update the product quantity and sold out flag
      await Product.findByIdAndUpdate(
        productId,
        {
          $inc: { quantity: -1 },
          $set: { soldOut: true },
        },
        { new: true }
      );
    }
  }
}
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
