const express = require('express');
const app = express();
const port = 8080;

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Delicakes 🎂');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});