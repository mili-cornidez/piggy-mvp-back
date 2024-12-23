import express from 'express';
import { checkUserOrCreate } from '../controllers/loginController';

const router = express.Router();

router.post('/check-user', checkUserOrCreate);

export default router;
