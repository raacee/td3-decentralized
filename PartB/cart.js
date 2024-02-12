// 3. Cart Routes

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Sample data for products
axios.get('http://localhost:3000/products')
    .then(response => {
        const products = response.data;
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });

    
let carts = {};

app.use(bodyParser.json());

//POST /cart/:userId
//Description: Adds a product to the user's shopping cart.
//Request Body: JSON object containing the product ID and quantity.
//Response: Updated contents of the cart, including product details and total price.
app.post('/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    // Find the product in the products array
    const product = products.find(p => p.id == productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Add the product to the user's cart or update the quantity
    if (!carts[userId]) {
        carts[userId] = {};
    }
    carts[userId][productId] = {
        product,
        quantity: (carts[userId][productId] ? carts[userId][productId].quantity : 0) + quantity
    };

    res.json({ cart: carts[userId], message: 'Product added to cart' });
});

//GET /cart/:userId
//Description: Retrieves the current state of a user's shopping cart.
//Request Body: None.
//Response: A JSON object listing the products in the cart, their quantities, and the total price.
app.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!carts[userId]) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    res.json({ cart: carts[userId] });
});

//DELETE /cart/:userId/item/:productId
//Description: Removes a specific product from the user's shopping cart.
//Request Body: None.
//Response: The updated contents of the cart after removal of the specified product.
app.delete('/cart/:userId/item/:productId', (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    if (!carts[userId] || !carts[userId][productId]) {
        return res.status(404).json({ error: 'Product not found in cart' });
    }

    delete carts[userId][productId];

    res.json({ cart: carts[userId], message: 'Product removed from cart' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});