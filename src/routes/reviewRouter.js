import { Router } from 'express';
import * as reviewController from '#controllers/reviewController.js';

const router = Router();

router.get('/movies/:movieId/reviews', reviewController.getByMovie);

router.post('/movies/:movieId/reviews', reviewController.create);

export default router;