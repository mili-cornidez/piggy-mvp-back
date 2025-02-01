import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import loginRouter from './routes/login';
import userRouter from './routes/user';

const app: Application = express();
const port: number = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors({
        origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    console.log('Params:', req.params);
    next();
});

app.use(express.json());

app.use('/api/login', loginRouter);
app.use('/api/user', userRouter);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

