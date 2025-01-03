import { Request, Response } from 'express';
import { getUserByWalletAddress, createOrUpdateUser, createChildAccount } from '../utils/db';

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

export const getUserChildren = async (req: Request, res: Response): Promise<void> => {
    const { walletAddress } = req.params;

    if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address is required' });
        return;
    }

    try {
        const user = await getUserByWalletAddress(walletAddress);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user.children || []);
    } catch (error) {
        console.error('Error fetching user children:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const addChildAccount = async (req: Request, res: Response): Promise<void> => {
    const { parentEmail, childData } = req.body;

    console.log('Received request to add child:', req.body);

    if (!parentEmail || !childData) {
        console.log('Missing required fields');
        res.status(400).json({ error: 'Parent email and child data are required' });
        return;
    }

    try {
        const newChildAccount = await createChildAccount(parentEmail, childData);
        res.status(201).json(newChildAccount);
    } catch (error: any) {
        console.error('Error adding child account:', error.message);
        res.status(500).json({ error: error.message });
    }
};


