import { Router } from 'express';
import * as statsController from '#controllers/statsController.js';

const router = Router();

router.get('/', statsController.getStats);
router.get('/test', statsController.test);

export default router;