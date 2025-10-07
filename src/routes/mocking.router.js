import { Router } from 'express';
import mockingController from '../controllers/mocking.controller.js';

const router = Router();

// GET /mockingpets?size=100
router.get('/', mockingController.getMockingPets);

export default router;
