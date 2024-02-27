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
        const id = parseInt(req.params.id);
        const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
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
            'INSERT INTO products (id, product, category, description, inStock, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, product, category, description, inStock, price]
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
        const id = parseInt(req.params.id);
        const updatedProduct = req.body;
        const result = await client.query(
            'UPDATE products SET product = $1, category = $2, description = $3, inStock = 45, price = $5 WHERE id = $6 RETURNING *',
            [updatedProduct.product, updatedProduct.category, updatedProduct.description, updatedProduct.inStock, updatedProduct.price, updatedProduct.id]
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
        const id = parseInt(req.params.id);
        const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
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



// ------------------ order ROUTES ------------------
app.get('/order', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM order');
        const orders = result.rows;
        res.json(orders);
        client.release();
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/order', async (req, res) => {
    try {
        const client = await pool.connect();
        const { products } = req.body;
        const orderId = generateOrderId(); // Assuming a function for generating unique IDs
        const total_price = calculatetotal_price(products); // Assuming a function for calculating total price

        const result = await client.query(
            'INSERT INTO "order" (orderId, userId, products, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [orderId, userId, products, total_price, 'pending']
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

function calculatetotal_price(products) {
    let total_price = 0;

    for (const product of products) {
        total_price += product.price * product.quantity;
    }
    return total_price;
}


// ------------------ CART ROUTES ------------------

//POST /cart/:userId
app.post('/cart', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { id, quantity } = req.body;
        // Check if product exists (simulating database check)
        if (!products.find(p => p.id === id)) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Handle existing cart and quantity update
        if (!cart[userId]) {
            cart[userId] = {};
        }
        cart[userId][id] = {
            product: products.find(p => p.id === id), // Ensure product details are included
            quantity: (cart[userId][id] ? cart[userId][id].quantity : 0) + quantity
        };
        res.json({ cart: cart[userId], message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//GET /cart/:userId
app.get('/cart', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const client = await pool.connect();
        const result = await client.query(
            'SELECT c.*, p.product, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.userId = $1',
            [userId]
        );
        const cartItems = result.rows;
        if (!cartItems.length) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        // Calculate total price (optional)
        const total_price = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        res.json({ cartItems, total_price });
        client.release();
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//DELETE /cart/:userId/item/:id
app.delete('/cart', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const id = parseInt(req.params.id);
        const client = await pool.connect();

        const existingCartItemResult = await client.query(
            'SELECT * FROM cart WHERE userId = $1 AND product_id = $2',
            [userId, id]
        );
        const existingCartItem = existingCartItemResult.rows[0];

        if (!existingCartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        await client.query('DELETE FROM cart WHERE userId = $1 AND product_id = $2', [userId, id]);

        const cartItemsResult = await client.query(
            'SELECT c.*, p.product, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.userId = $1',
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