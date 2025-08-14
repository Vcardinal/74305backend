import { Router } from 'express';
import ProductManager from '../managers/product.manager.js';

const router = Router();
const manager = new ProductManager();

// Obtener productos con paginación, filtro y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, nombre } = req.query;
    const result = await manager.getAll({ limit, page, sort, nombre });
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', mensaje: 'Error al obtener productos', error: error.message });
  }
});

// Obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const producto = await manager.getById(req.params.pid);
    if (!producto) {
      return res.status(404).json({ status: 'error', mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ status: 'error', mensaje: 'Error al obtener el producto', error: error.message });
  }
});

// Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, precio } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ status: 'error', mensaje: 'Faltan campos obligatorios' });
    }
    const nuevo = await manager.createProduct({ nombre, precio });
    res.status(201).json({ status: 'success', producto: nuevo });
  } catch (error) {
    res.status(500).json({ status: 'error', mensaje: 'Error al crear el producto', error: error.message });
  }
});

// Actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const actualizado = await manager.updateProduct(req.params.pid, req.body);
    if (!actualizado) {
      return res.status(404).json({ status: 'error', mensaje: 'Producto no encontrado' });
    }
    res.json({ status: 'success', producto: actualizado });
  } catch (error) {
    res.status(500).json({ status: 'error', mensaje: 'Error al actualizar el producto', error: error.message });
  }
});

// Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const eliminado = await manager.deleteProduct(req.params.pid);
    if (!eliminado) {
      return res.status(404).json({ status: 'error', mensaje: 'Producto no encontrado' });
    }
    res.json({ status: 'success', mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', mensaje: 'Error al eliminar el producto', error: error.message });
  }
});

export default router;


