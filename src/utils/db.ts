import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const getUserByWalletAddress = async (walletAddress: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
};

export const createOrUpdateUser = async (userData: { email: string; wallet_address: string; wallet_balance?: number }) => {
    const { data, error } = await supabase
        .from('users')
        .upsert([{
            email: userData.email,
            wallet_address: userData.wallet_address,
            wallet_balance: userData.wallet_balance ?? 0
        }], { onConflict: ('email') });

    if (error) throw new Error(error.message);
    return data;
};

export const createChildAccount = async (parentEmail: string, childData: { name: string; birthdate: string; email: string }) => {
    const { data: parent, error: parentError } = await supabase
        .from('users')
        .select('id')
        .eq('email', parentEmail)
        .maybeSingle();

    if (parentError || !parent) throw new Error('Parent user not found');

    const [day, month, year] = childData.birthdate.split('/');
    const formattedBirthdate = `${year}-${month}-${day}`;

    const { data, error } = await supabase
        .from('children')
        .insert([{
            parent_id: parent.id,
            name: childData.name,
            birthdate: formattedBirthdate,
            email: childData.email,
            wallet_balance: 0
        }]);

    if (error) throw new Error(error.message);
    return data;
};

