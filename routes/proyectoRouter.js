import express from 'express';
import {
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador
} from '../controllers/proyectoController.js'
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
    .route('/')
    .post(checkAuth,nuevoProyecto);

router
    .route('/:id')
    .get(checkAuth,obtenerProyecto)
    .put(checkAuth,editarProyecto)
    .delete(checkAuth,eliminarProyecto);

export default router;