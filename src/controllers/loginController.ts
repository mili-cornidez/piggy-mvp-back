import { Request, Response } from 'express';
import { readDB, writeDB } from '../utils/db';

export const handleLogin = (req: Request, res: Response): void => {
    const { email, wallet_address } = req.body;

    if (!email || !wallet_address) {
        res.status(400).json({ error: 'Email and wallet address are required' });
        return;
    }

    try {
        const db = readDB();
        const users = db.users || [];

        const existingUser = users.find((u: any) =>
            u.email === email ||
            (u.wallet_address && u.wallet_address.toLowerCase() === wallet_address.toLowerCase())
        );

        if (existingUser) {
            const updatedUser = {
                ...existingUser,
                email,
                wallet_address,
                wallet_balance: existingUser.wallet_balance ?? 0
            };

            const updatedUsers = users.map((u: any) =>
                (u.email === email || (u.wallet_address && u.wallet_address.toLowerCase() === wallet_address.toLowerCase()))
                    ? updatedUser
                    : u
            );

            writeDB({ users: updatedUsers });

            res.status(200).json({
                message: 'User exists and updated',
                user: updatedUser,
                exists: true
            });
            return;
        }

        const newUser = {
            email,
            wallet_address,
            wallet_balance: 0
        };

        users.push(newUser);

        writeDB({ users });

        res.status(201).json({
            message: 'User created',
            user: newUser,
            exists: false
        });
    } catch (error) {
        console.error('Error in handleLogin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
