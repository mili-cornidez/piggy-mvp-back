import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../database/db.json');

export const readDB = (): any => {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

export const writeDB = (data: any): void => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};
