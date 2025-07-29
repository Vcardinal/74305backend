const express = require('express');
const router = express.Router();
const CartManager = require('../managers/cart.manager');

// POST /api/carts → Crear carrito vacío
router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await CartManager.createCart();
        res.status(201).json(nuevoCarrito);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// GET /api/carts/:cid → Ver productos del carrito
router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    if (isNaN(cid)) {
        return res.status(400).json({ error: 'ID de carrito inválido' });
    }

    try {
        const carrito = await CartManager.getById(cid);
        if (!carrito) {
            return res.status(404).json({ mensaje: "Carrito no encontrado" });
        }
        res.json(carrito.products);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// POST /api/carts/:cid/product/:pid → Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).json({ error: 'ID de carrito o producto inválido' });
    }

    try {
        const carrito = await CartManager.addProductToCart(cid, pid);
        res.status(200).json({ mensaje: "Producto agregado al carrito", carrito });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

module.exports = router;

