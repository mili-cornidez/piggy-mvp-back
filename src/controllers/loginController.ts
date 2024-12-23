import { Request, Response } from 'express';
import { readDB, writeDB } from '../utils/db';

export const checkUserOrCreate = (req: Request, res: Response): void => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        const db = readDB();
        const users = db.users || [];

        const userExists = users.some((u: any) => u.email === email);

        if (userExists) {
            const existingUser = users.find((u: any) => u.email === email);
            res.status(200).json({ message: 'User exists', user: existingUser, exists: true });
            return;
        }

        const newUser = { email, wallet_balance: 0 };
        users.push(newUser);

        writeDB({ users });

        res.status(201).json({ message: 'User created', user: newUser, exists: false });
    } catch (error) {
        console.error('Error checking or creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


