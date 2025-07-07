const express = require('express');
const router = express.Router();

let products = [
    { id: 1, nombre: "Torta chocolate", Precio: 1500 },
    { id: 2, nombre: "Cupcakes", Precio: 900 },
    { id: 3, nombre: "Mini Pastelería", Precio: 1500 }
];
let nextId = 4;

router.get('/', (req, res) => {
    res.status(200).json(products);
});

router.get('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(product);
});

router.post('/', (req, res) => {
    const { nombre, Precio } = req.body;
    if (!nombre || !Precio) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }
    const nuevoProducto = { id: nextId++, nombre, Precio };
    products.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

module.exports = router;