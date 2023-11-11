import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import usuarioRouter from './routes/usuarioRouter.js';
import equipoRouter from './routes/equipoRouter.js';
import proyectoRouter from './routes/proyectoRouter.js';
import tareaRouter from './routes/tareaRouter.js';
 


const app = express();
app.use(express.json());

dotenv.config();

connectDB();

// ======================= Cors =======================

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        if (whiteList.includes(origin)) {
            //Puede consultar API
            callback(null, true);
        } else {
            //No esta permitido su request
            callback(new Error('Error de Cors'));
        }
    }
};

app.use(cors(corsOptions));

// ======================= Routing =======================

app.use('/api/usuarios',usuarioRouter)
app.use('/api/equipos',equipoRouter)
app.use('/api/proyectos',proyectoRouter)
app.use('/api/tareas',tareaRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
