const fs = require('fs').promises;
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

class ProductManager {
    async getAll() {
        const data = await fs.readFile(productsPath, 'utf-8');
        return JSON.parse(data);
    }

    async getById(id) {
        const products = await this.getAll();
        return products.find(p => p.id === id);
    }

    async add({ nombre, Precio }) {
        const products = await this.getAll();
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            nombre,
            Precio
        };
        products.push(newProduct);
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
        return newProduct;
    }
}

module.exports = new ProductManager();
