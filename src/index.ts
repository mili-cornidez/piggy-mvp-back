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

// Cargar certificados SSL
const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};

// Configurar CORS para permitir solicitudes desde el frontend (HTTPS)
app.use(cors({
    origin: 'https://localhost:3000', // O cambiar por tu dominio en producción
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Rutas
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/privy", privyRouter);


// Iniciar el servidor HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`🚀 Secure Server running at https://localhost:${port}`);
});
