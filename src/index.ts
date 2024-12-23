import express from 'express';
import cors from 'cors';
import loginRoutes from './routes/login';

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json());

app.use('/api/login', loginRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
