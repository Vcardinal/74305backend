const express = require('express');
const router = express.Router();

let carts = [];
let nextCartId = 1;

// POST /api/carts
router.post('/', (req, res) => {
    const nuevoCarrito = {
        id: nextCartId++,
        products: []
    };
    carts.push(nuevoCarrito);
    res.status(201).json(nuevoCarrito);
});

// GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const carrito = carts.find(c => c.id === cid);
    if (!carrito) {
        return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
    res.json(carrito.products);
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const carrito = carts.find(c => c.id === cid);
    if (!carrito) {
        return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    const productoEnCarrito = carrito.products.find(p => p.product === pid);
    if (productoEnCarrito) {
        productoEnCarrito.quantity += 1;
    } else {
        carrito.products.push({ product: pid, quantity: 1 });
    }

    res.status(200).json({ mensaje: "Producto agregado al carrito", carrito });
});

module.exports = router;