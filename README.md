Adoptme - Backend (Mocking y manejo de errores)

Descripción:
Esta aplicación es un backend para manejar usuarios, mascotas y adopciones. Incluye módulos de mocking que permiten generar datos de prueba (mascotas y usuarios) y un manejador centralizado de errores. Puede ejecutarse totalmente en local sin necesidad de una base de datos externa usando el modo in-memory.

Endpoints de interés:
- GET /api/mocks/mockingpets?size=100  -> genera mascotas mock
- GET /api/mocks/mockingusers?size=50  -> genera usuarios mock (password: coder123 encriptada)
- POST /api/mocks/generateData { users, pets } -> genera e inserta datos en la DB (o en memoria si se usa el modo local)

Para levantar en local sin Mongo:
1) Instalar dependencias: `npm install`
2) Ejecutar: `$env:USE_IN_MEMORY='true'; npm start`

Agustin Lavandero Ivelic
