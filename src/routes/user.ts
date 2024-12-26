import express from 'express';
import { getUserBalance, createUser } from '../controllers/userController';

const router = express.Router();

router.get('/balance/:walletAddress', getUserBalance);
router.post('/create', createUser);

export default router;
