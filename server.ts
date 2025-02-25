import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Register a new store
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const store = await prisma.store.create({
            data: { name, email, password },
        });
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ error: 'Error creating store' });
    }
});

// Get all stores (Super Admin only)
app.get('/stores', async (req, res) => {
    try {
        const stores = await prisma.store.findMany({
            include: {
                products: true,
                purchases: true,
                sales: true,
            },
        });
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stores' });
    }
});

// Add a product to a store
app.post('/products', async (req, res) => {
    const { storeId, name, category, barcode, price, quantity } = req.body;
    try {
        const product = await prisma.product.create({
            data: { storeId, name, category, barcode, price, quantity },
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error adding product' });
    }
});

// Get all products in a store
app.get('/products/:storeId', async (req, res) => {
    const { storeId } = req.params;
    try {
        const products = await prisma.product.findMany({ where: { storeId } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Record a purchase
app.post('/purchases', async (req, res) => {
    const { storeId, productId, date } = req.body;
    try {
        const purchase = await prisma.purchase.create({
            data: { storeId, productId, date: date || new Date() },
        });
        res.status(201).json(purchase);
    } catch (error) {
        res.status(500).json({ error: 'Error recording purchase' });
    }
});

// Record a sale
app.post('/sales', async (req, res) => {
    const { storeId, productId, date } = req.body;
    try {
        const sale = await prisma.sale.create({
            data: { storeId, productId, date: date || new Date() },
        });
        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ error: 'Error recording sale' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
