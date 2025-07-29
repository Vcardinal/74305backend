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

    async add({ nombre, precio }) {
        const products = await this.getAll();

        //sumo  validaciones pedidas en el proyecto
        if (!nombre || typeof nombre !== 'string') {
            throw new Error('El nombre es obligatorio y debe ser una cadena.');
        }

        if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
            throw new Error('El precio debe ser un número mayor a 0.');
        }

        const existe = products.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
        if (existe) {
            throw new Error('Ya existe un producto con ese nombre.');
        }

        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            nombre,
            precio
        };

        products.push(newProduct);
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
        return newProduct;
    }
}

module.exports = new ProductManager();

