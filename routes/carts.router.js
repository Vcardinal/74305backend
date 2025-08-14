import { Router } from 'express';
import CartManager from '../managers/cart.manager.js';

const router = Router();
const manager = new CartManager();

// Crear carrito
router.post('/', async (req, res) => {
  try {
    const cart = await manager.createCart();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await manager.getById(req.params.cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await manager.addProductToCart(req.params.cid, req.params.pid);
    res.json({ mensaje: 'Producto agregado al carrito', carrito: cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await manager.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({ mensaje: 'Producto eliminado del carrito', carrito: cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await manager.emptyCart(req.params.cid);
    res.json({ mensaje: 'Carrito vaciado correctamente', carrito: cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Eliminar carrito por completo
router.delete('/delete/:cid', async (req, res) => {
  try {
    await manager.deleteCart(req.params.cid);
    res.json({ mensaje: 'Carrito eliminado correctamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Actualizar cantidad de producto
router.put('/:cid/product/:pid', async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await manager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    res.json({ mensaje: 'Cantidad actualizada', carrito: cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Obtener resumen con totales
router.get('/:cid/resumen', async (req, res) => {
  try {
    const resumen = await manager.getCartResumen(req.params.cid);
    res.json(resumen);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
