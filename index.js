const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');

const ProductManager = require('./managers/product.manager');
const CartManager = require('./managers/cart.manager');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = 8080;

// 🛠️ Configuración Handlebars con helper "multiply"
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

// 🌐 Rutas principales
app.get('/', async (req, res) => {
    const products = await ProductManager.getAll();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await ProductManager.getAll();
    const cart = await CartManager.getById(1); // ID fijo por ahora

    const carritoEnriquecido = cart.products.map(item => {
        const producto = products.find(p => p.id === item.product);
        return {
            product: item.product,
            nombre: producto?.nombre || "Producto desconocido",
            precio: producto?.precio || 0,
            quantity: item.quantity
        };
    });

    res.render('realTimeProducts', {
        products,
        carrito: carritoEnriquecido
    });
});

app.get('/cartview', async (req, res) => {
    const cart = await CartManager.getById(1);
    const products = await ProductManager.getAll();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    const carritoEnriquecido = cart.products.map(item => {
        const producto = products.find(p => p.id === item.product);
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
            await ProductManager.add(data);
            const productosActualizados = await ProductManager.getAll();
            io.emit('productosActualizados', productosActualizados);
        } catch (err) {
            console.error('❌ Error al agregar producto:', err.message);
        }
    });

    socket.on('productoEliminado', async () => {
        const productosActualizados = await ProductManager.getAll();
        io.emit('productosActualizados', productosActualizados);
    });
});

// 🚀 Iniciar servidor
httpServer.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});

