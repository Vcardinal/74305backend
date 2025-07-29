const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/product.manager');

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await ProductManager.getAll();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await ProductManager.getById(id);
        if (!product) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    const { nombre, precio } = req.body;

    if (!nombre || precio === undefined) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios: nombre y precio" });
    }

    try {
        const nuevoProducto = await ProductManager.add({ nombre, precio });
        res.status(201).json(nuevoProducto);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
