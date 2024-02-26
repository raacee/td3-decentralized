const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg');
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'mdp',
    port: 5432,
});

// ------------------ PRODUCTS ROUTES ------------------
app.get('/products', async (req, res) => {
    try {
        const client = await pool.connect();
        const { category, inStock } = req.query;
        let query = 'SELECT * FROM products';

        if (category) {
            query += ` WHERE category = '${category}'`;
        }

        if (inStock) {
            const inStockValue = inStock.toLowerCase() === 'true';
            query += ` AND stock_status = ${inStockValue}`;
        }

        const result = await client.query(query);
        res.json(result.rows);
        client.release();
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/products/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const productId = parseInt(req.params.id);
        const result = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
        const product = result.rows[0];

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }

        client.release();
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/products', async (req, res) => {
    try {
        const client = await pool.connect();
        const { name, price, description, category, inStock } = req.body;
        const result = await client.query(
            'INSERT INTO products (name, price, description, category, instock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, price, description, category, inStock]
        );
        const product = result.rows[0];
        res.json(product);
        client.release();
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/products/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const productId = parseInt(req.params.id);
        const updatedProduct = req.body;
        const result = await client.query(
            'UPDATE products SET name = $1, price = $2, description = $3, category = $4, instock = $5 WHERE id = $6 RETURNING *',
            [updatedProduct.name, updatedProduct.price, updatedProduct.description, updatedProduct.category, updatedProduct.inStock, productId]
        );
        const updatedProductData = result.rows[0];
        if (!updatedProductData) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(updatedProductData);
        }
        client.release();
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/products/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const productId = parseInt(req.params.id);
        const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);
        const deletedProduct = result.rows[0];
        if (!deletedProduct) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ message: 'Product deleted', product: deletedProduct });
        }
        client.release();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// ------------------ ORDERS ROUTES ------------------
app.get('/orders', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM orders');
        const orders = result.rows;
        res.json(orders);
        client.release();
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/orders', async (req, res) => {
    try {
        const client = await pool.connect();
        const { products } = req.body;
        const orderId = generateOrderId(); // Assuming a function for generating unique IDs
        const totalPrice = calculateTotalPrice(products); // Assuming a function for calculating total price

        const result = await client.query(
            'INSERT INTO orders (order_id, products, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [orderId, products, totalPrice, 'pending']
        );
        const order = result.rows[0];

        res.json(order);
        client.release();
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Helper function to generate a unique order ID
function generateOrderId() {
    return Math.random().toString(36).substr(2, 9);
}

function calculateTotalPrice(products) {
    let totalPrice = 0;

    for (const product of products) {
        totalPrice += product.price * product.quantity;
    }
    return totalPrice;
}


// ------------------ CART ROUTES ------------------

//POST /cart/:userId
app.post('/cart/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { productId, quantity } = req.body;
        // Check if product exists (simulating database check)
        if (!products.find(p => p.id === productId)) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Handle existing cart and quantity update
        if (!carts[userId]) {
            carts[userId] = {};
        }
        carts[userId][productId] = {
            product: products.find(p => p.id === productId), // Ensure product details are included
            quantity: (carts[userId][productId] ? carts[userId][productId].quantity : 0) + quantity
        };
        res.json({ cart: carts[userId], message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//GET /cart/:userId
app.get('/cart/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const client = await pool.connect();
        const result = await client.query(
            'SELECT c.*, p.name, p.price FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
            [userId]
        );
        const cartItems = result.rows;
        if (!cartItems.length) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        // Calculate total price (optional)
        const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        res.json({ cartItems, totalPrice });
        client.release();
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//DELETE /cart/:userId/item/:productId
app.delete('/cart/:userId/item/:productId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const productId = parseInt(req.params.productId);
        const client = await pool.connect();

        const existingCartItemResult = await client.query(
            'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        const existingCartItem = existingCartItemResult.rows[0];

        if (!existingCartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        await client.query('DELETE FROM carts WHERE user_id = $1 AND product_id = $2', [userId, productId]);

        const cartItemsResult = await client.query(
            'SELECT c.*, p.name, p.price FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
            [userId]
        );
        const cartItems = cartItemsResult.rows;
        res.json({ cart: cartItems, message: 'Product removed from cart' });
        client.release();
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`E-commerce API server running at http://localhost:${port}`);
});