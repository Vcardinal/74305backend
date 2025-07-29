const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs').promises;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const ProductManager = require('./managers/product.manager');
const CartManager = require('./managers/cart.manager');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const port = 8080;

// Configuración Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', async (req, res) => {
  const products = await ProductManager.getAll();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await ProductManager.getAll();
  res.render('realTimeProducts', { products });
});

app.get('/cartview', async (req, res) => {
  const cid = 1;
  const cart = await CartManager.getById(cid);
  const allProducts = await ProductManager.getAll();

  const carritoEnriquecido = cart.products.map(item => {
    const productoInfo = allProducts.find(p => p.id === item.product);
    return {
      nombre: productoInfo?.nombre || "Producto desconocido",
      precio: productoInfo?.precio || 0,
      quantity: item.quantity
    };
  });

  const total = carritoEnriquecido.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  res.render('cartView', { carrito: carritoEnriquecido, total });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// WebSocket
io.on('connection', socket => {
  console.log('🟢 Cliente conectado por WebSocket');

  socket.on('nuevoProducto', async (data) => {
    try {
      await ProductManager.add(data);
      const productosActualizados = await ProductManager.getAll();
      io.emit('productosActualizados', productosActualizados);
    } catch (err) {
      console.error('Error al agregar producto:', err.message);
    }
  });

  socket.on('eliminarProducto', async (id) => {
    try {
      const productos = await ProductManager.getAll();
      const filtrados = productos.filter(p => p.id !== id);
      await fs.writeFile(
        path.join(__dirname, 'data/products.json'),
        JSON.stringify(filtrados, null, 2)
      );
      io.emit('productosActualizados', filtrados);
    } catch (err) {
      console.error('Error al eliminar producto:', err.message);
    }
  });

  socket.on('agregarAlCarrito', async (pid) => {
    const cid = 1;

    await CartManager.addProductToCart(cid, pid);
    const cart = await CartManager.getById(cid);
    const allProducts = await ProductManager.getAll();

    const carritoEnriquecido = cart.products.map(item => {
      const productoInfo = allProducts.find(p => p.id === item.product);
      return {
        nombre: productoInfo?.nombre || 'Desconocido',
        precio: productoInfo?.precio || 0,
        quantity: item.quantity
      };
    });

    io.emit('carritoActualizado', carritoEnriquecido);
  });
});

// Iniciar servidor
httpServer.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
