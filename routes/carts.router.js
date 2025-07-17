const express = require('express');
const router = express.Router();
const CartManager = require('../managers/cart.manager');

// POST /api/carts
router.post('/', async (req, res) => {
    const nuevoCarrito = await CartManager.createCart();
    res.status(201).json(nuevoCarrito);
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const carrito = await CartManager.getById(cid);
    if (!carrito) {
        return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
    res.json(carrito.products);
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const carrito = await CartManager.addProductToCart(cid, pid);
    if (!carrito) {
        return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    res.status(200).json({ mensaje: "Producto agregado al carrito", carrito });
});

module.exports = router;
