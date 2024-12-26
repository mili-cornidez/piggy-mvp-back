// userController.ts
import { Request, Response } from 'express';
import { getUserByWalletAddress, createOrUpdateUser } from '../utils/db';

export const getUserBalance = async (req: Request, res: Response): Promise<void> => {
    const { walletAddress } = req.params;

    try {
        const user = await getUserByWalletAddress(walletAddress);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ balance: user.wallet_balance });
    } catch (error) {
        console.error('Error fetching user balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, wallet_address } = req.body;

        if (!email || !wallet_address) {
            res.status(400).json({ error: 'Email and wallet address are required' });
            return;
        }

        const user = await createOrUpdateUser({ email, wallet_address });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};