import { Request, Response } from 'express';
import {getUserByWalletAddress, createOrUpdateUser, createChildAccount, supabase} from '../utils/db';

export const getUserBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            res.status(400).json({ error: "Wallet address is required" });
            return;
        }

        const user = await getUserByWalletAddress(walletAddress);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ balance: user.wallet_balance });
    } catch (error) {
        console.error('Error in getUserBalance:', (error as Error).stack || (error as Error).message);
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

        res.status(201).json({
            message: 'User created or updated successfully',
            user,
        });
    } catch (error: any) {
        console.error('Error in createUser:', error.stack || error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};


export const getUserChildren = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            res.status(400).json({ error: 'Wallet address is required' });
            return;
        }

        console.log(`Fetching children for wallet: ${walletAddress}`);

        const user = await getUserByWalletAddress(walletAddress);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { data: children, error } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', user.id);

        if (error) {
            console.error('Error fetching children:', error.message);
            res.status(500).json({ error: 'Error fetching children' });
            return;
        }

        res.status(200).json({
            message: 'Children retrieved successfully',
            children: children || []
        });
    } catch (error) {
        console.error('Error fetching user children:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const addChildAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { parentEmail, childData } = req.body;

        if (!parentEmail || !childData) {
            console.log('Missing required fields:', req.body);
            res.status(400).json({ error: 'Parent email and child data are required' });
            return;
        }

        console.log(`Adding child account for parent: ${parentEmail}`, childData);

        const newChildAccount = await createChildAccount(parentEmail, childData);

        res.status(201).json({
            message: 'Child account created successfully',
            childAccount: newChildAccount,
        });
    } catch (error: any) {
        console.error('Error adding child account:', error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};