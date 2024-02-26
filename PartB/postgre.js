const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'mdp',
    port: 5432,
});

const app = express();
const PORT = 3001;

app.get('/products', async (req, res) => {
    try {
        const { category, inStock } = req.query;

        let query = 'SELECT * FROM products';

        if (category) {
            query += ` WHERE category = '${category}'`;
        }

        if (inStock) {
            const inStockValue = inStock.toLowerCase() === 'true';
            query += ` AND stock_status = ${inStockValue}`;
        }

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
