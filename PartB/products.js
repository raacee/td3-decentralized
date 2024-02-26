const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let products = [
    { id: 1, product: 'Hammer', price: 15.99, category: 'Tools', inStock: false, description: 'A versatile tool used for driving nails or breaking objects apart.' },
    { id: 2, product: 'Mallet', price: 24.99, category: 'Tools', inStock: true, description: 'A hammer-like tool with a large, usually wooden head, used for striking chisels or driving in wooden dowels.' },
    { id: 3, product: 'Saw', price: 12.99, category: 'Tools', inStock: true, description: 'A cutting tool consisting of a blade with a series of teeth, used for cutting through various materials.' },
    { id: 4, product: 'Circular Saw', price: 29.99, category: 'Tools', inStock: false, description: 'A power tool with a circular blade, used for making straight or angled cuts in wood, metal, or plastic.' },
    { id: 5, product: 'Jigsaw', price: 17.99, category: 'Tools', inStock: true, description: 'A power tool with a reciprocating blade, used for cutting curved or irregular shapes in wood, metal, or plastic.' },
    { id: 6, product: 'Hedge Trimmer', price: 34.99, category: 'Tools', inStock: false, description: 'A gardening tool with a serrated blade, used for trimming or shaping hedges or bushes.' },
    { id: 7, product: 'Screwdriver', price: 9.99, category: 'Tools', inStock: true, description: 'A hand tool with a shaped tip, used for turning screws or bolts.' },
    { id: 8, product: 'Bubble Level', price: 14.99, category: 'Tools', inStock: true, description: 'A tool with a liquid-filled tube and a bubble, used for determining if a surface is level or plumb.' },
    { id: 9, product: 'Adjustable Wrench', price: 11.99, category: 'Tools', inStock: true, description: 'A wrench with a movable jaw, used for gripping and turning nuts, bolts, or pipes of various sizes.' },
    { id: 10, product: 'Measuring Tape', price: 16.99, category: 'Tools', inStock: true, description: 'A flexible ruler used for measuring distances or dimensions.' },
    { id: 11, product: 'Electric Sander', price: 21.99, category: 'Tools', inStock: false, description: 'A power tool used for smoothing or finishing surfaces by abrasion with sandpaper.' },
    { id: 12, product: 'Wire Stripper', price: 27.99, category: 'Tools', inStock: true, description: 'A tool used for removing insulation from electrical wires.' },
    { id: 13, product: 'File', price: 10.99, category: 'Tools', inStock: true, description: 'A hand tool with roughened surfaces, used for shaping or smoothing wood, metal, or plastic.' },
    { id: 14, product: 'Laser Level', price: 34.99, category: 'Tools', inStock: true, description: 'A leveling tool that emits laser beams to create a straight, horizontal or vertical reference line.' },
    { id: 15, product: 'Paintbrush Set', price: 8.99, category: 'Painting Supplies', inStock: true, description: 'A set of brushes used for applying paint to surfaces.' },
    { id: 16, product: 'Wood Glue', price: 5.99, category: 'Adhesives', inStock: true, description: 'A strong adhesive specifically designed for bonding wood surfaces together.' },
    { id: 17, product: 'Sanding Block', price: 4.99, category: 'Finishing Supplies', inStock: false, description: 'A block-shaped tool with abrasive surfaces, used for smoothing or finishing surfaces by abrasion.' },
    { id: 18, product: 'Safety Glasses', price: 3.99, category: 'Safety Equipment', inStock: true, description: 'Protective eyewear designed to protect the eyes from hazards during work.' },
    { id: 19, product: 'Measuring Square', price: 6.99, category: 'Measurement Tools', inStock: true, description: 'A measuring tool with a right-angle shape, used for marking or checking squareness.' },
    { id: 20, product: 'Paint Roller', price: 9.99, category: 'Painting Supplies', inStock: true, description: 'A cylindrical tool with a handle, used for applying paint quickly and evenly to large surfaces.' },
    { id: 21, product: 'Caulking Gun', price: 7.99, category: 'Adhesives', inStock: true, description: 'A handheld tool used for dispensing caulk or sealant in a controlled manner.' },
    { id: 22, product: 'Wire Cutter', price: 12.99, category: 'Electrical Tools', inStock: true, description: 'A tool with sharp blades, used for cutting electrical wires or other thin materials.' },
    { id: 23, product: 'Garden Gloves', price: 4.99, category: 'Gardening Tools', inStock: true, description: 'Protective gloves worn during gardening tasks to shield hands from dirt, thorns, or chemicals.' },
    { id: 24, product: 'Stud Finder', price: 14.99, category: 'Measurement Tools', inStock: true, description: 'A handheld device used to locate framing studs behind walls or other surfaces.' },
  ];

app.get('/products', (req, res) => {
    const { category, inStock } = req.query;

    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    if (inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock === (inStock === 'true'));
    }

    res.json(filteredProducts);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);

    if (!product) {
        res.status(404).json({ error: 'Product not found' });
    } else {
        res.json(product);
    }
});

app.post('/products', (req, res) => {
    const newProductId = products.length + 1;
    const newProduct = { id: newProductId, ...req.body }
    products.push(newProduct);
    res.json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const newProductId = parseInt(req.params.id);
    const updatedProduct = req.body;
    let productIndex = products.findIndex(product => product.id === newProductId);

    if (productIndex === -1) {
        res.status(404).json({ error: 'Product not found' });
    } else {
        let product = products[productIndex];
        product = { ...product, ...updatedProduct };
        products[productIndex] = product;
        res.json(product);
    }
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        res.status(404).json({ error: 'Product not found' });
    } else {
        const deletedProduct = products.splice(productIndex, 1)[0];
        res.json({ message: 'Product deleted', product: deletedProduct });
    }
});

app.listen(port, () => {
    console.log(`E-commerce API server running at http://localhost:${port}`);
});