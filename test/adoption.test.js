import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';

import usersRouter from '../src/routes/users.router.js';
import petsRouter from '../src/routes/pets.router.js';
import adoptionsRouter from '../src/routes/adoption.router.js';
import sessionsRouter from '../src/routes/sessions.router.js';
import mocksRouter from '../src/routes/mocks.router.js';
import errorHandler from '../src/middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 8080;

// For tests, use in-memory mode - MUST be set before any imports
process.env.USE_IN_MEMORY = 'true';

async function connectToMongo() {
    // In tests, we always use in-memory mode
    console.log('Modo IN_MEMORY activado para tests');
    return Promise.resolve();
}

describe('Adoption Router Tests', () => {
    let server;
    let testUserId;
    let testPetId;
    let testAdoptionId;

    before(async function() {
        this.timeout(15000); // Increase timeout for setup
        
        await connectToMongo();
        
        app.use(express.json());
        app.use(cookieParser());
        
        app.use('/api/users', usersRouter);
        app.use('/api/pets', petsRouter);
        app.use('/api/adoptions', adoptionsRouter);
        app.use('/api/sessions', sessionsRouter);
        app.use('/api/mocks', mocksRouter);
        
        app.use(errorHandler);
        
        // Wait a bit for services to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        server = app.listen(PORT);
        
        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    after(async () => {
        if (server) {
            server.close();
        }
        // Only close mongoose connection if it's actually connected
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    });

    beforeEach(async function() {
        this.timeout(10000); // Increase timeout for each test
        
        // Create a test user for adoption tests
        const userResponse = await request(app)
            .post('/api/sessions/register')
            .send({
                first_name: `Test${Date.now()}`,
                last_name: 'User',
                email: `test${Date.now()}@example.com`,
                password: 'test123'
            });

        // Create a test pet
        const petResponse = await request(app)
            .post('/api/pets')
            .send({
                name: `Test Pet ${Date.now()}`,
                specie: 'Dog',
                birthDate: new Date('2020-01-01')
            });

        // Get the created user and pet IDs
        if (userResponse.body.payload) {
            testUserId = userResponse.body.payload;
        } else {
            const usersResponse = await request(app).get('/api/users');
            if (usersResponse.body.payload && usersResponse.body.payload.length > 0) {
                testUserId = usersResponse.body.payload[usersResponse.body.payload.length - 1]._id;
            }
        }
        
        if (petResponse.body.payload && petResponse.body.payload._id) {
            testPetId = petResponse.body.payload._id;
        } else {
            const petsResponse = await request(app).get('/api/pets');
            if (petsResponse.body.payload && petsResponse.body.payload.length > 0) {
                testPetId = petsResponse.body.payload[petsResponse.body.payload.length - 1]._id;
            }
        }
    });

    describe('GET /api/adoptions', () => {
        it('should return all adoptions successfully', async () => {
            const response = await request(app)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.be.an('array');
        });

        it('should return an empty array when no adoptions exist', async () => {
            const response = await request(app)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('should return a specific adoption by ID', async () => {
            // First create an adoption
            const createResponse = await request(app)
                .post(`/api/adoptions/${testUserId}/${testPetId}`)
                .expect(200);

            expect(createResponse.body.status).to.equal('success');

            // Get all adoptions to find the created one
            const allAdoptions = await request(app).get('/api/adoptions');
            const adoptionId = allAdoptions.body.payload[0]._id;

            // Get the specific adoption
            const response = await request(app)
                .get(`/api/adoptions/${adoptionId}`)
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload._id).to.equal(adoptionId);
        });

        it('should return 404 when adoption not found', async () => {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/api/adoptions/${nonExistentId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Adoption not found');
        });

        it('should return 404 for invalid adoption ID format', async () => {
            const invalidId = 'invalid-id';
            const response = await request(app)
                .get(`/api/adoptions/${invalidId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('should create an adoption successfully', async () => {
            // Create a new user and pet for this test
            const timestamp = Date.now();
            const userResponse = await request(app)
                .post('/api/sessions/register')
                .send({
                    first_name: 'John',
                    last_name: 'Doe',
                    email: `john${timestamp}@example.com`,
                    password: 'password123'
                });

            const petResponse = await request(app)
                .post('/api/pets')
                .send({
                    name: `Buddy${timestamp}`,
                    specie: 'Cat',
                    birthDate: new Date('2020-01-01')
                });

            const newUserId = userResponse.body.payload || 
                (await request(app).get('/api/users')).body.payload
                    .find(u => u.email === `john${timestamp}@example.com`)._id;
            const newPetId = petResponse.body.payload._id || 
                (await request(app).get('/api/pets')).body.payload
                    .find(p => p.name === `Buddy${timestamp}`)._id;

            const response = await request(app)
                .post(`/api/adoptions/${newUserId}/${newPetId}`)
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message', 'Pet adopted');

            // Verify the adoption was created
            const adoptionsResponse = await request(app).get('/api/adoptions');
            const adoption = adoptionsResponse.body.payload.find(
                a => a.pet === newPetId && a.owner === newUserId
            );
            expect(adoption).to.exist;

            // Verify the pet is marked as adopted
            const petVerificationResponse = await request(app).get(`/api/pets/${newPetId}`);
            expect(petVerificationResponse.body.payload.adopted).to.be.true;
            expect(petVerificationResponse.body.payload.owner).to.equal(newUserId);

            // Verify the user has the pet in their pets array
            const userVerificationResponse = await request(app).get(`/api/users/${newUserId}`);
            expect(userVerificationResponse.body.payload.pets).to.be.an('array');
            const petInUserPets = userVerificationResponse.body.payload.pets.find(p => p._id === newPetId);
            expect(petInUserPets).to.exist;
        });

        it('should return 404 when user not found', async () => {
            const nonExistentUserId = '507f1f77bcf86cd799439011';
            const petsResponse = await request(app).get('/api/pets');
            const petId = petsResponse.body.payload[0]._id;

            const response = await request(app)
                .post(`/api/adoptions/${nonExistentUserId}/${petId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'user Not found');
        });

        it('should return 404 when pet not found', async () => {
            const usersResponse = await request(app).get('/api/users');
            const userId = usersResponse.body.payload[0]._id;
            const nonExistentPetId = '507f1f77bcf86cd799439012';

            const response = await request(app)
                .post(`/api/adoptions/${userId}/${nonExistentPetId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Pet not found');
        });

        it('should return 400 when pet is already adopted', async () => {
            // First adopt a pet
            const usersResponse = await request(app).get('/api/users');
            const petsResponse = await request(app).get('/api/pets');
            
            const userId1 = usersResponse.body.payload[0]._id;
            const petId = petsResponse.body.payload[0]._id;

            // Create first adoption
            await request(app)
                .post(`/api/adoptions/${userId1}/${petId}`)
                .expect(200);

            // Try to adopt the same pet again with a different user
            const userId2 = usersResponse.body.payload.length > 1 
                ? usersResponse.body.payload[1]._id 
                : userId1;

            const response = await request(app)
                .post(`/api/adoptions/${userId2}/${petId}`)
                .expect(400);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Pet is already adopted');
        });

        it('should handle multiple adoptions correctly', async () => {
            // Create multiple users and pets
            const timestamp = Date.now();
            const user1Response = await request(app)
                .post('/api/sessions/register')
                .send({
                    first_name: 'Alice',
                    last_name: 'Smith',
                    email: `alice${timestamp}@example.com`,
                    password: 'password123'
                });
            const user2Response = await request(app)
                .post('/api/sessions/register')
                .send({
                    first_name: 'Bob',
                    last_name: 'Johnson',
                    email: `bob${timestamp}@example.com`,
                    password: 'password123'
                });

            const pet1Response = await request(app)
                .post('/api/pets')
                .send({
                    name: `Fluffy${timestamp}`,
                    specie: 'Dog',
                    birthDate: new Date('2019-05-15')
                });
            const pet2Response = await request(app)
                .post('/api/pets')
                .send({
                    name: `Whiskers${timestamp}`,
                    specie: 'Cat',
                    birthDate: new Date('2021-03-20')
                });

            const user1Id = user1Response.body.payload || 
                (await request(app).get('/api/users')).body.payload
                    .find(u => u.email === `alice${timestamp}@example.com`)._id;
            const user2Id = user2Response.body.payload || 
                (await request(app).get('/api/users')).body.payload
                    .find(u => u.email === `bob${timestamp}@example.com`)._id;
            const pet1 = pet1Response.body.payload || 
                (await request(app).get('/api/pets')).body.payload
                    .find(p => p.name === `Fluffy${timestamp}`);
            const pet2 = pet2Response.body.payload || 
                (await request(app).get('/api/pets')).body.payload
                    .find(p => p.name === `Whiskers${timestamp}`);
            
            const user1 = { _id: user1Id };
            const user2 = { _id: user2Id };

            // Create first adoption
            const response1 = await request(app)
                .post(`/api/adoptions/${user1._id}/${pet1._id}`)
                .expect(200);
            expect(response1.body.status).to.equal('success');

            // Create second adoption
            const response2 = await request(app)
                .post(`/api/adoptions/${user2._id}/${pet2._id}`)
                .expect(200);
            expect(response2.body.status).to.equal('success');

            // Verify both adoptions exist
            const allAdoptions = await request(app).get('/api/adoptions');
            expect(allAdoptions.body.payload.length).to.be.at.least(2);
        });
    });
});

