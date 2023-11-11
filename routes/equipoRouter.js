import express from 'express';
import {
    obtenerEquipos,
    nuevoEquipo,
    obtenerEquipo,
    editarEquipo,
    eliminarEquipo,
    buscarMiembro,
    agregarMiembro,
    eliminarMiembro
} from '../controllers/equipoController.js';
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
    .route('/')
    .get(checkAuth,obtenerEquipos)
    .post(checkAuth,nuevoEquipo);

router
    .route('/:id')
    .get(checkAuth,obtenerEquipo)
    .put(checkAuth,editarEquipo)
    .delete(checkAuth,eliminarEquipo);

router.post('/miembros',checkAuth,buscarMiembro)
router.post('/agregar-miembro/:id',checkAuth,agregarMiembro)

export default router;