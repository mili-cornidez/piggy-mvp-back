import { Request, Response } from 'express';
import { getUserByWalletAddress, createOrUpdateUser } from '../utils/db';

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, wallet_address } = req.body;

    if (!email || !wallet_address) {
        res.status(400).json({ error: 'Email and wallet address are required' });
        return;
    }

    try {
        let user = await getUserByWalletAddress(wallet_address);

        if (user) {
            user = await createOrUpdateUser({
                email,
                wallet_address,
                wallet_balance: user.wallet_balance
            });

            res.status(200).json({
                message: 'User exists and updated',
                user,
                exists: true
            });
        } else {
            user = await createOrUpdateUser({
                email,
                wallet_address,
                wallet_balance: 0
            });

            res.status(201).json({
                message: 'User created',
                user,
                exists: false
            });
        }
    } catch (error: any) {
        console.error('Error in handleLogin:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
