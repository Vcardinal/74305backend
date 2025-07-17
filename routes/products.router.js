const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/product.manager');

// GET /api/products
router.get('/', async (req, res) => {
    const products = await ProductManager.getAll();
    res.status(200).json(products);
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = await ProductManager.getById(id);
    if (!product) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(product);
});

// POST /api/products
router.post('/', async (req, res) => {
    const { nombre, Precio } = req.body;
    if (!nombre || !Precio) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const nuevoProducto = await ProductManager.add({ nombre, Precio });
    res.status(201).json(nuevoProducto);
});

module.exports = router;    
