import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = JSON.parse(readFileSync(join(__dirname, '../Swagger/swagger.json'), 'utf8'));

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT||8080;
// Conexión a Mongo: preferir variable de entorno MONGO_URI; si no existe, usar MongoMemoryServer
// Sin embargo, si USE_IN_MEMORY=true queremos que la app funcione totalmente sin Mongo (usar DAOs en memoria)
const MONGO_URI = process.env.MONGO_URI;
const USE_IN_MEMORY = process.env.USE_IN_MEMORY === 'true';

async function connectToMongo(){
	if(USE_IN_MEMORY){
		console.log('Modo IN_MEMORY activado: no se establecerá conexión con Mongo (usar DAOs en memoria)');
		return Promise.resolve();
	}
	if(MONGO_URI){
		return mongoose.connect(MONGO_URI);
	}
	// arrancar Mongo en memoria para desarrollo local si no se indicó USE_IN_MEMORY
	const mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();
	console.log('Usando Mongo en memoria:', uri);
	return mongoose.connect(uri);
}

connectToMongo().catch(err=>{
	console.error('Error conectando a Mongo:', err);
	process.exit(1);
});

app.use(express.json());
app.use(cookieParser());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
// Router para endpoints de mocking (mock pets, mock users, generar datos)
app.use('/api/mocks', mocksRouter);

// Manejador centralizado de errores
app.use(errorHandler);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
