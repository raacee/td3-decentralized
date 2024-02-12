const express = require('express');
const app = express();
const port = 3001;

// Dummy data for demonstration purposes
let orders = [];

app.use(express.json());

app.post('/orders', (req, res) => {
  const { products } = req.body;

  // Generate a unique order ID
  const orderId = generateOrderId();

  // Calculate the total price of the order
  const totalPrice = calculateTotalPrice(products);

  // Create the new order object
  const newOrder = {
    orderId,
    products,
    totalPrice,
    status: 'pending',
  };

  // Add the new order to the orders array
  orders.push(newOrder);

  res.json(newOrder);
});

let newOrder = {
    orderId: 1,
    products: 'Hammer',
    totalPrice: 21.99
  };
  


app.get('/orders', (req, res) => {
  res.json(newOrder);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Helper function to generate a unique order ID
function generateOrderId() {
  return Math.random().toString(36).substr(2, 9);
}

// Helper function to calculate the total price of the order
function calculateTotalPrice(products) {
  let totalPrice = 0;

  for (const product of products) {
    // Assuming each product has a 'price' property
    totalPrice += product.price * product.quantity;
  }

  return totalPrice;
}