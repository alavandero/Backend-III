# Adoptme - Backend API

## 📋 Descripción

API REST para gestionar usuarios, mascotas y adopciones. Incluye módulos de mocking para generar datos de prueba, manejo centralizado de errores y puede ejecutarse en modo in-memory sin necesidad de base de datos externa. Documentación completa disponible en Swagger.

## 🚀 Instalación

### Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **MongoDB** (opcional): Solo si no usas modo in-memory
- **Docker** (opcional): Para ejecutar con contenedores

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Backend-III
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
```bash
# Crear archivo .env (opcional)
PORT=8080
MONGO_URI=mongodb://localhost:27017/adoptme
USE_IN_MEMORY=false
```

4. **Ejecutar la aplicación**

#### Opción A: Modo in-memory (sin MongoDB)
```bash
# Windows PowerShell
$env:USE_IN_MEMORY='true'; npm start

# Linux/Mac
USE_IN_MEMORY=true npm start
```

#### Opción B: Con MongoDB local
```bash
npm start
```

#### Opción C: Modo desarrollo (con nodemon)
```bash
npm run dev
```

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor en modo producción |
| `npm run dev` | Inicia el servidor en modo desarrollo con nodemon (auto-reload) |
| `npm test` | Ejecuta los tests funcionales del módulo de adopciones |

## 🔌 Endpoints de la API

### Base URL
```
http://localhost:8080/api
```

### 🔐 Autenticación (Sessions)

#### POST `/api/sessions/register`
Registrar un nuevo usuario.

**Request Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "payload": "507f1f77bcf86cd799439011"
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "error": "User incomplete values"
}
```

#### POST `/api/sessions/login`
Iniciar sesión.

**Request Body:**
```json
{
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "payload": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/api/sessions/current`
Obtener información del usuario actual (requiere token en cookie).

**Response (200):**
```json
{
  "status": "success",
  "payload": {
    "name": "Juan Pérez",
    "role": "user",
    "email": "juan.perez@example.com"
  }
}
```

### 👥 Usuarios (Users)

#### GET `/api/users`
Obtener todos los usuarios.

**Response (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@example.com",
      "role": "user",
      "pets": []
    }
  ]
}
```

#### GET `/api/users/:uid`
Obtener un usuario por ID.

**Response (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439011",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@example.com",
    "role": "user",
    "pets": []
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "error": "User not found"
}
```

#### PUT `/api/users/:uid`
Actualizar un usuario.

**Request Body:**
```json
{
  "first_name": "Juan Carlos",
  "last_name": "Pérez García"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User updated"
}
```

#### DELETE `/api/users/:uid`
Eliminar un usuario.

**Response (200):**
```json
{
  "status": "success",
  "message": "User deleted"
}
```

### 🐾 Mascotas (Pets)

#### GET `/api/pets`
Obtener todas las mascotas.

**Response (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Max",
      "specie": "Dog",
      "birthDate": "2020-01-15T00:00:00.000Z",
      "adopted": false,
      "owner": null,
      "image": null
    }
  ]
}
```

#### POST `/api/pets`
Crear una nueva mascota.

**Request Body:**
```json
{
  "name": "Max",
  "specie": "Dog",
  "birthDate": "2020-01-15"
}
```

**Response (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Max",
    "specie": "Dog",
    "birthDate": "2020-01-15T00:00:00.000Z",
    "adopted": false,
    "owner": null
  }
}
```

#### POST `/api/pets/withimage`
Crear una mascota con imagen (multipart/form-data).

**Request:** Form-Data
- `name`: "Max"
- `specie`: "Dog"
- `birthDate`: "2020-01-15"
- `image`: (archivo)

#### PUT `/api/pets/:pid`
Actualizar una mascota.

**Request Body:**
```json
{
  "name": "Maximus",
  "adopted": true
}
```

#### DELETE `/api/pets/:pid`
Eliminar una mascota.

**Response (200):**
```json
{
  "status": "success",
  "message": "Pet deleted"
}
```

### 🏠 Adopciones (Adoptions)

#### GET `/api/adoptions`
Obtener todas las adopciones.

**Response (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "owner": "507f1f77bcf86cd799439011",
      "pet": "507f1f77bcf86cd799439012"
    }
  ]
}
```

#### GET `/api/adoptions/:aid`
Obtener una adopción por ID.

**Response (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439013",
    "owner": "507f1f77bcf86cd799439011",
    "pet": "507f1f77bcf86cd799439012"
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "error": "Adoption not found"
}
```

#### POST `/api/adoptions/:uid/:pid`
Crear una adopción (adoptar una mascota).

**Response (200):**
```json
{
  "status": "success",
  "message": "Pet adopted"
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "error": "user Not found"
}
```
o
```json
{
  "status": "error",
  "error": "Pet not found"
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "error": "Pet is already adopted"
}
```

### 🎲 Mocking (Generación de datos de prueba)

#### GET `/api/mocks/mockingpets?size=100`
Genera mascotas mock (no las inserta en la DB).

**Query Parameters:**
- `size`: Número de mascotas a generar (default: 100)

**Response (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "...",
      "name": "Mock Pet 1",
      "specie": "Dog",
      "adopted": false,
      ...
    }
  ]
}
```

#### GET `/api/mocks/mockingusers?size=50`
Genera usuarios mock (no los inserta en la DB).

**Query Parameters:**
- `size`: Número de usuarios a generar (default: 50)

#### POST `/api/mocks/generateData`
Genera e inserta datos en la base de datos.

**Request Body:**
```json
{
  "users": 10,
  "pets": 20
}
```

**Response (200):**
```json
{
  "status": "success",
  "created": {
    "users": 10,
    "pets": 20
  },
  "usersCount": 10,
  "petsCount": 20
}
```

## 📖 Documentación API

La documentación interactiva completa está disponible en Swagger UI:

**Swagger UI:** http://localhost:8080/api-docs

Aquí puedes ver todos los endpoints, probarlos directamente y ver los schemas de datos.

## 🐳 Docker

### Imagen de Docker en DockerHub

La imagen de Docker del proyecto está disponible en DockerHub:
**https://hub.docker.com/r/agustinlavanderoivelic/backend_iii_adoptme**

### Construir la imagen de Docker

Para construir la imagen localmente:

```bash
docker build -t adoptme-backend:latest .
```

### Ejecutar el contenedor

#### Modo in-memory (sin base de datos externa):
```bash
docker run -d -p 8080:8080 -e USE_IN_MEMORY=true adoptme-backend:latest
```

#### Con MongoDB (usando variable de entorno):
```bash
docker run -d -p 8080:8080 -e MONGO_URI=mongodb://tu-mongo-uri adoptme-backend:latest
```

#### Con MongoDB en memoria (para desarrollo):
```bash
docker run -d -p 8080:8080 adoptme-backend:latest
```

### Ejecutar desde DockerHub

Para ejecutar directamente la imagen desde DockerHub:

```bash
docker run -d -p 8080:8080 -e USE_IN_MEMORY=true agustinlavanderoivelic/backend_iii_adoptme:latest
```

### Variables de entorno

El contenedor soporta las siguientes variables de entorno:

- `PORT`: Puerto en el que se ejecutará la aplicación (por defecto: 8080)
- `MONGO_URI`: URI de conexión a MongoDB (opcional)
- `USE_IN_MEMORY`: Si se establece a 'true', usa DAOs en memoria sin necesidad de MongoDB

### Verificar que el contenedor está funcionando

Una vez que el contenedor esté ejecutándose, puedes acceder a:

- API: http://localhost:8080
- Documentación Swagger: http://localhost:8080/api-docs

### Ver logs del contenedor

```bash
docker logs <container-id>
```

### Detener el contenedor

```bash
docker stop <container-id>
```

## 🧪 Tests

### Tests Actuales

Los tests funcionales están implementados para el módulo de adopciones:

```bash
npm test
```

**Cobertura actual:**
- ✅ GET /api/adoptions - Obtener todas las adopciones
- ✅ GET /api/adoptions/:aid - Obtener adopción por ID (éxito y errores)
- ✅ POST /api/adoptions/:uid/:pid - Crear adopción (éxito y todos los casos de error)

**Total:** 11 tests que verifican casos de éxito y error.

### Tests Futuros

Planeado implementar tests para:

- [ ] **Módulo de Usuarios**
  - [ ] GET /api/users
  - [ ] GET /api/users/:uid
  - [ ] PUT /api/users/:uid
  - [ ] DELETE /api/users/:uid

- [ ] **Módulo de Mascotas**
  - [ ] GET /api/pets
  - [ ] POST /api/pets
  - [ ] POST /api/pets/withimage
  - [ ] PUT /api/pets/:pid
  - [ ] DELETE /api/pets/:pid

- [ ] **Módulo de Sesiones**
  - [ ] POST /api/sessions/register
  - [ ] POST /api/sessions/login
  - [ ] GET /api/sessions/current

- [ ] **Tests de Integración**
  - [ ] Flujo completo de adopción
  - [ ] Autenticación y autorización
  - [ ] Manejo de errores end-to-end

- [ ] **Tests de Rendimiento**
  - [ ] Carga con múltiples usuarios
  - [ ] Concurrent requests

## 🔧 Troubleshooting

### Problema: Error "Cannot read properties of undefined"

**Solución:** 
- Asegúrate de usar Node.js v18 o superior
- Verifica que todas las dependencias estén instaladas: `npm install`
- Si usas Docker, reconstruye la imagen: `docker build --no-cache -t adoptme-backend:latest .`

### Problema: Puerto 8080 ya está en uso

**Solución:**
```bash
# Cambiar el puerto mediante variable de entorno
PORT=3000 npm start

# O en Docker
docker run -d -p 3000:8080 -e PORT=8080 adoptme-backend:latest
```

### Problema: Error de conexión a MongoDB

**Solución:**
- Si no tienes MongoDB instalado, usa el modo in-memory:
```bash
USE_IN_MEMORY=true npm start
```
- Verifica que MongoDB esté corriendo si usas conexión externa
- Revisa la URI de conexión en la variable `MONGO_URI`

### Problema: Los datos no persisten

**Solución:**
- En modo in-memory, los datos se pierden al reiniciar el servidor (comportamiento esperado)
- Para persistencia, usa MongoDB real o cambia a modo MongoDB con `MONGO_URI`

### Problema: Tests fallan

**Solución:**
- Asegúrate de que el servidor no esté corriendo en el puerto 8080 durante los tests
- Verifica que todas las dependencias de desarrollo estén instaladas:
```bash
npm install --include=dev
```

### Problema: Error en Docker build

**Solución:**
- Verifica que el Dockerfile esté en el directorio raíz
- Limpia el caché de Docker:
```bash
docker system prune -a
docker build --no-cache -t adoptme-backend:latest .
```

### Problema: Swagger no carga

**Solución:**
- Verifica que el servidor esté corriendo
- Accede a http://localhost:8080/api-docs (no olvides el puerto)
- Revisa los logs del servidor para errores

## 📝 Ejemplos de Uso

### Ejemplo 1: Flujo completo de adopción

```bash
# 1. Registrar un usuario
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Juan","last_name":"Pérez","email":"juan@example.com","password":"pass123"}'

# 2. Crear una mascota
curl -X POST http://localhost:8080/api/pets \
  -H "Content-Type: application/json" \
  -d '{"name":"Max","specie":"Dog","birthDate":"2020-01-15"}'

# 3. Adoptar la mascota (usar IDs reales)
curl -X POST http://localhost:8080/api/adoptions/USER_ID/PET_ID
```

### Ejemplo 2: Generar datos de prueba

```bash
# Generar 50 usuarios y 100 mascotas
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users":50,"pets":100}'
```

### Ejemplo 3: Consultar datos

```bash
# Obtener todos los usuarios
curl http://localhost:8080/api/users

# Obtener todas las adopciones
curl http://localhost:8080/api/adoptions

# Obtener una mascota específica
curl http://localhost:8080/api/pets/PET_ID
```

## 🏗️ Estructura del Proyecto

```
Backend-III/
├── src/
│   ├── controllers/       # Controladores de cada módulo
│   ├── dao/              # Data Access Objects (MongoDB y In-Memory)
│   ├── dto/              # Data Transfer Objects
│   ├── errors/           # Manejo de errores personalizados
│   ├── middlewares/      # Middlewares de Express
│   ├── models/           # Modelos de Mongoose
│   ├── repository/       # Capa de repositorio
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio
│   └── utils/            # Utilidades varias
├── Swagger/              # Documentación Swagger
├── test/                 # Tests funcionales
├── Dockerfile            # Configuración de Docker
├── package.json          # Dependencias y scripts
└── README.md            # Este archivo
```

## 🔒 Seguridad

- Las contraseñas se encriptan usando bcrypt
- Tokens JWT para autenticación
- Validación de datos en los controladores
- Manejo centralizado de errores

## 📚 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB / Mongoose** - Base de datos
- **JWT** - Autenticación
- **Swagger/OpenAPI** - Documentación
- **Docker** - Contenedorización
- **Mocha/Chai** - Testing

## 👤 Autor

**Agustin Lavandero Ivelic**

## 📄 Licencia

ISC

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Nota:** Este proyecto está en constante desarrollo. Para reportar bugs o sugerencias, por favor abre un issue en el repositorio.
