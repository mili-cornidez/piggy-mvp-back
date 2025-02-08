import express from 'express';
import { addChildAccount } from '../controllers/userController';

const router = express.Router();

router.post('/add-account', addChildAccount);

export default router;
