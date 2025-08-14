# 📦 Delicakes API - Backend para sistema de productos y carritos

Este proyecto es  una API  desarrollada con Node.js, Express y MongoDB para gestionar un sistema de productos de pastelería y carritos de compra. Incluye lo solicitado en el proyecto, filtros, paginación, ordenamiento y vistas dinámicas con Handlebars, el websocket lo había presentado en la propuest anterior, lo deje 

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tuusuario/delicakes-api.git
```

2. Instalar las dependencias:
```bash
npm install
```

3. Asegurarse de tener MongoDB corriendo localmente en `mongodb://127.0.0.1:27017/pasteleria`

## 🧾 Ejecución

```bash
npm start
```

El servidor se levantará en:  
[http://localhost:8080](http://localhost:8080)

## 🧱 Estructura del proyecto

```
├── index.js
├── managers/
├── models/
├── public/
├── routes/
├── views/
├── package.json
├── package-lock.json
├── readme.md

```

## 🔁 Rutas y funcionalidades

### 📦 Productos (`/api/products`)

- `GET /` → Obtener productos con soporte para:
  - Filtros por nombre (`?nombre=...`)
  - Paginación (`?page=1&limit=5`)
  - Ordenamiento por precio (`?sort=asc|desc`)
  - Retorna metadata completa (`totalPages`, `prevLink`, etc.)
- `GET /:pid` → Obtener producto por ID
- `POST /` → Crear nuevo producto
- `PUT /:pid` → Actualizar producto
- `DELETE /:pid` → Eliminar producto

### 🛒 Carritos (`/api/carts`)

- `POST /` → Crear un nuevo carrito
- `GET /:cid` → Obtener detalle del carrito
- `POST /:cid/product/:pid` → Agregar producto al carrito
- `DELETE /:cid/product/:pid` → Eliminar producto del carrito


## ⚙️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Socket.io
- Bootstrap 5

## 👩‍💻 Autor

Verónica Cardinal