import { CartModel } from '../models/Cart.model.js';

export default class CartManager {
  async getAll() {
    return await CartModel.find();
  }

  async getById(cid) {
    return await CartModel.findById(cid).populate('products.product').lean();
  }

  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const existingProduct = cart.products.find(p => p.product.toString() === pid.toString());
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const index = cart.products.findIndex(p => p.product.toString() === pid.toString());
    if (index === -1) throw new Error('Producto no encontrado en el carrito');

    cart.products.splice(index, 1);
    await cart.save();
    return cart;
  }

  async emptyCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const product = cart.products.find(p => p.product.toString() === pid);
    if (!product) throw new Error('Producto no encontrado en el carrito');

    product.quantity = quantity;
    await cart.save();
    return cart;
  }

  async deleteCart(cid) {
    const result = await CartModel.findByIdAndDelete(cid);
    if (!result) throw new Error('Carrito no encontrado');
    return result;
  }

  async getCartResumen(cid) {
    const cart = await CartModel.findById(cid).populate('products.product');
    if (!cart) throw new Error('Carrito no encontrado');

    const productos = cart.products.map(p => ({
      id: p.product._id,
      nombre: p.product.nombre,
      precio: p.product.precio,
      cantidad: p.quantity,
      subtotal: p.product.precio * p.quantity
    }));

    const total = productos.reduce((acc, p) => acc + p.subtotal, 0);

    return { productos, total };
  }
}


