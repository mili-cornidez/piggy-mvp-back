import express from 'express';
import { getUserBalance, createUser, addChildAccount, getUserChildren } from '../controllers/userController';

const router = express.Router();

router.post('/create', createUser);
router.get('/:walletAddress/balance', getUserBalance);
router.get('/:walletAddress/children', getUserChildren);
router.post('/:walletAddress/add-child', addChildAccount);

export default router;
