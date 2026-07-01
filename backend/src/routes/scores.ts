import { Router } from 'express';
import { ScoreController } from '../controllers/ScoreController';

const router = Router();
const controller = new ScoreController();

router.get('/:sbd', (req, res) => controller.getScores(req, res));

export default router;
