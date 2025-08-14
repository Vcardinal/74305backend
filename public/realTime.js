const socket = io();

const form = document.getElementById('productForm');
const productList = document.getElementById('productList');
const cartList = document.getElementById('cartList');

const cartId = '689de77b3de2317bf59f53fc';

// Enviar nuevo producto
form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const precio = parseFloat(form.precio.value);

    if (!nombre || isNaN(precio) || precio <= 0) {
        alert('Por favor ingresá un nombre y precio válidos.');
        return;
    }

    socket.emit('nuevoProducto', { nombre, precio });
    form.reset();
});

// Actualizar lista de productos
socket.on('productosActualizados', productos => {
    productList.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.innerHTML = `
            <span><strong>${p.nombre}</strong> – $${p.precio}</span>
            <div>
                <button class="btn btn-sm btn-agregar me-2" onclick="agregarAlCarrito('${p._id}')">➕</button>
                <button class="btn btn-sm btn-eliminar" onclick="eliminarProducto('${p._id}')">🗑️</button>
            </div>
        `;
        productList.appendChild(li);
    });
});

// Agregar al carrito usando el id 
function agregarAlCarrito(productId) {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Producto agregado al carrito');
        actualizarVistaCarrito();
    })
    .catch(err => console.error('Error al agregar producto:', err));
}

// Eliminar producto completamente
function eliminarProducto(productId) {
    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Producto eliminado');
        socket.emit('productoEliminado');
    })
    .catch(err => console.error('Error al eliminar producto:', err));
}

// Refrescar el carrito
function actualizarVistaCarrito() {
    fetch('/cartview')
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const nuevosItems = doc.querySelectorAll('#carrito-productos li');
            cartList.innerHTML = '';
            nuevosItems.forEach(li => cartList.appendChild(li));
        })
        .catch(err => console.error('Error al actualizar carrito:', err));
}

// Actualizar lista de productos
socket.on('productosActualizados', productos => {
    productList.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.innerHTML = `
            <span><strong>${p.nombre}</strong> – $${p.precio}</span>
            <div>
                <button class="btn btn-sm btn-success me-2" onclick="agregarAlCarrito(${p.id})">➕</button>
                <button class="btn btn-sm btn-danger btn-eliminar" onclick="eliminarProducto(${p.id})">🗑️</button>
            </div>
        `;
        productList.appendChild(li);
    });
});

//Agregar producto
function agregarAlCarrito(productId) {
    fetch(`/api/carts/1/product/${productId}`, {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Producto agregado al carrito');
        actualizarVistaCarrito();
    });
}

//eliminar producto 
function eliminarProducto(productId) {
    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Producto eliminado');
        socket.emit('productoEliminado'); 
    });
}

function actualizarVistaCarrito() {
    fetch('/cartview')
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const nuevosItems = doc.querySelectorAll('#carrito-productos li');
            cartList.innerHTML = '';
            nuevosItems.forEach(li => cartList.appendChild(li));
        });
}
