const fs = require('fs').promises;
const path = require('path');

const cartsPath = path.join(__dirname, '../data/carts.json');

class CartManager {
    async getAll() {
        const data = await fs.readFile(cartsPath, 'utf-8');
        return JSON.parse(data);
    }

    async getById(id) {
        const carts = await this.getAll();
        return carts.find(c => c.id === id);
    }

    async createCart() {
        const carts = await this.getAll();
        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getAll();
        const cart = carts.find(c => c.id === cid);
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.product === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async removeProductFromCart(cid, pid) {
        const carts = await this.getAll();
        const cart = carts.find(c => c.id === cid);
        if (!cart) return null;

        const productoExiste = cart.products.find(p => p.product === pid);
        if (!productoExiste) return null;

        cart.products = cart.products.filter(p => p.product !== pid);
        await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = new CartManager();


