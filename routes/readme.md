# 🧁 Delicakes Backend API

Servidor backend con Node.js y Express que gestiona productos y carritos de compra, escuchando en el puerto 8080. Utiliza routers separados para `/api/products` y `/api/carts`.

## 🚀 Cómo ejecutar

El servidor en: `http://localhost:8080`

---

## 📦 Funcionalidad de Productos (`/api/products`)

### 🔹 1. Obtener todos los productos
- **Método:** GET
- **URL:** `/api/products`
- **Descripción:** Lista completa de productos

### 🔹 2. Obtener producto por ID
- **Método:** GET
- **URL:** `/api/products/:pid`
- **Ejemplo:** `/api/products/2`
- **Descripción:** Devuelve un producto si existe, o error 404

### 🔹 3. Agregar un producto, elige el nombre y el precio
- **Método:** POST
- **URL:** `/api/products`
- **Body (JSON):**
  ```json
  {
    "nombre": "Nombre del producto",
    "Precio": 850
  }
  ```
- **Descripción:** Agrega un producto con ID autogenerado

---

## 🛒 Funcionalidad de Carritos (`/api/carts`)

### 🔹 4. Crear un nuevo carrito
- **Método:** POST
- **URL:** `/api/carts`
- **Descripción:** Crea un carrito con ID autogenerado y array vacío de productos

### 🔹 5. Ver productos de un carrito
- **Método:** GET
- **URL:** `/api/carts/:cid`
- **Ejemplo:** `/api/carts/1`
- **Descripción:** Lista los productos de un carrito

### 🔹 6. Agregar producto a un carrito
- **Método:** POST
- **URL:** `/api/carts/:cid/product/:pid`
- **Ejemplo:** `/api/carts/1/product/2`
- **Descripción:** Agrega un producto al carrito. Si ya existe, aumenta `quantity`

---

## 🧪 Ejemplo de flujo de uso

1. Crear productos con `POST /api/products` (o usar los preexistentes)
2. Crear un carrito con `POST /api/carts`
3. Agregar productos al carrito con `POST /api/carts/:cid/product/:pid`
4. Consultar el carrito con `GET /api/carts/:cid`