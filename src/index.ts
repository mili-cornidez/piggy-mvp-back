import express, { Application } from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import loginRouter from "./routes/login";
import userRouter from "./routes/user";
import privyRouter from "./routes/privy";

dotenv.config();

const app: Application = express();
const port: number = process.env.PORT ? Number(process.env.PORT) : 3001;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};

app.use(cors({
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/privy", privyRouter);


https.createServer(options, app).listen(port, () => {
    console.log(`Secure Server running at https://localhost:${port}`);
});
