import { Router } from 'express';
import { TopGroupAController } from '../controllers/TopGroupAController';

const router = Router();
const controller = new TopGroupAController();

// GET /api/v1/top-group-a
router.get('/', (req, res) => controller.getTopGroupA(req, res));

export default router;
