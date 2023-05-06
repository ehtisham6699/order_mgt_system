const Order = require("./Models/OrderSchema");
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
      let modifiedProducts = await Product.updateMany(
        { _id: { $in: order.products } },
        { soldOut: true },
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`${res.nModified} products updated`);
          }
        }
      );
    }
    return {
      statusCode: 200,
      body: JSON.stringify(modifiedProducts),
    };
  } catch (err) {
    console.error("Error processing Order:", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
}
exports.getCustomerOrder = async (event, context) => {
  try {
    await connectDB();
    const request = JSON.parse(event.body._id);

    // find all orders for a specific user
    let allOrders = await find({ customer: request }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(allOrders),
    };
  } catch (err) {
    console.error("Error fetching  all orders:", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
