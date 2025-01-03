interface ChildAccount {
    name: string;
    birthdate: string;
    email: string;
    balance: number;
}

export interface User {
    email: string;
    wallet_address: string;
    wallet_balance: number;
    children?: ChildAccount[];
}

export const users: User[] = [];
