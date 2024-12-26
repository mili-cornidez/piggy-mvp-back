import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import loginRouter from './routes/login';
import userRouter from './routes/user';

const app: Application = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000',
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
