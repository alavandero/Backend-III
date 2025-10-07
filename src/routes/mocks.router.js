import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

// GET /api/mocks/mockingpets?size=100
router.get('/mockingpets', mocksController.getMockingPets);
// GET /api/mocks/mockingusers?size=50
router.get('/mockingusers', mocksController.getMockingUsers);
// POST /api/mocks/generateData  body: { users: <n>, pets: <n> }
router.post('/generateData', mocksController.generateData);

export default router;
