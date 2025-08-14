import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';

import ProductManager from './managers/product.manager.js';
import CartManager from './managers/cart.manager.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧩 Instancias
const productManager = new ProductManager();
const cartManager = new CartManager();

// 🔗 Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/pasteleria')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 8080;

// 🎨 Handlebars
const hbs = exphbs.create({
  helpers: {
    multiply: (a, b) => a * b
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 🧱 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🌐 Rutas de vistas
app.get('/', async (req, res) => {
  const result = await productManager.getAll({});
  res.render('home', { products: result.payload });
});

app.get('/realtimeproducts', async (req, res) => {
  const result = await productManager.getAll({});
  const carts = await cartManager.getAll();
  const cart = carts[0];

  const carritoEnriquecido = cart?.products.map(item => {
    const producto = result.payload.find(p => p._id.toString() === item.product.toString());
    return {
      product: item.product,
      nombre: producto?.nombre || "Producto desconocido",
      precio: producto?.precio || 0,
      quantity: item.quantity
    };
  }) || [];

  res.render('realTimeProducts', {
    products: result.payload,
    carrito: carritoEnriquecido
  });
});

app.get('/cartview', async (req, res) => {
  const result = await productManager.getAll({});
  const carts = await cartManager.getAll();
  const cart = carts[0];

  if (!cart) return res.status(404).send("Carrito no encontrado");

  const carritoEnriquecido = cart.products.map(item => {
    const producto = result.payload.find(p => p._id.toString() === item.product.toString());
    return {
      product: item.product,
      nombre: producto?.nombre || "Producto desconocido",
      precio: producto?.precio || 0,
      quantity: item.quantity
    };
  });

  const total = carritoEnriquecido.reduce((sum, item) => sum + (item.precio * item.quantity), 0);

  res.render('cartView', {
    carrito: carritoEnriquecido,
    total
  });
});

// 🌐 Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// 🔌 WebSocket
io.on('connection', socket => {
  console.log('🟢 Cliente conectado por WebSocket');

  socket.on('nuevoProducto', async (data) => {
    try {
      await productManager.createProduct(data);
      const result = await productManager.getAll({});
      io.emit('productosActualizados', result.payload);
    } catch (err) {
      console.error('❌ Error al agregar producto:', err.message);
    }
  });

  socket.on('productoEliminado', async () => {
    const result = await productManager.getAll({});
    io.emit('productosActualizados', result.payload);
  });
});

// 🚀 Iniciar servidor
httpServer.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});

