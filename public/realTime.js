const socket = io();

const form = document.getElementById('productForm');
const productList = document.getElementById('productList');
const cartList = document.getElementById('cartList');

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
                <button class="btn btn-sm btn-success me-2" onclick="agregarAlCarrito(${p.id})">➕</button>
                <button class="btn btn-sm btn-danger btn-eliminar" onclick="eliminarProducto(${p.id})">🗑️</button>
            </div>
        `;
        productList.appendChild(li);
    });
});

// Función para agregar al carrito (carrito ID fijo = 1)
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

// Función para eliminar producto completamente
function eliminarProducto(productId) {
    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Producto eliminado');
        socket.emit('productoEliminado'); // Esto hará que se refresque la lista por WebSocket
    });
}

// Refrescar vista de productos agregados al carrito (para mostrar en tiempo real)
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
