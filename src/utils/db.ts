import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../database/db.json');

export const readDB = (): any => {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

export const writeDB = (data: any): void => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        throw error;
    }
};

export const getUserByWalletAddress = async (walletAddress: string): Promise<any> => {
    const db = readDB();
    return db.users.find((user: any) =>
        user.wallet_address?.toLowerCase() === walletAddress.toLowerCase()
    );
};

export const createOrUpdateUser = async (userData: {
    email: string;
    wallet_address: string;
    wallet_balance?: number;
}): Promise<any> => {
    const db = readDB();
    const existingUserIndex = db.users.findIndex(
        (user: any) => user.email === userData.email ||
            user.wallet_address?.toLowerCase() === userData.wallet_address.toLowerCase()
    );

    if (existingUserIndex >= 0) {
        db.users[existingUserIndex] = {
            ...db.users[existingUserIndex],
            ...userData,
            wallet_balance: userData.wallet_balance ?? db.users[existingUserIndex].wallet_balance
        };
    } else {
        db.users.push({
            ...userData,
            wallet_balance: userData.wallet_balance ?? 0,
            children: [],
        });
    }

    writeDB(db);
    return db.users[existingUserIndex >= 0 ? existingUserIndex : db.users.length - 1];
};

export const createChildAccount = async (parentEmail: string, childData: any): Promise<any> => {
    const db = readDB();
    const parentIndex = db.users.findIndex((user: any) => user.email === parentEmail);

    if (parentIndex === -1) {
        throw new Error('Parent user not found');
    }

    const childAccount = {
        ...childData,
        wallet_balance: 0,
        id: `child-${Date.now()}`
    };

    if (!db.users[parentIndex].children) {
        db.users[parentIndex].children = [];
    }

    db.users[parentIndex].children.push(childAccount);
    writeDB(db);

    return childAccount;
};
