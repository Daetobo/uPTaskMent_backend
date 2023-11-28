import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {
    nuevoSprint,
    editarSprint,
    eliminarSprint
} from '../controllers/sprintController.js'

const router = express.Router();

router
    .route('/')
    .post(checkAuth,nuevoSprint)

router
    .route('/:id')
    .put(checkAuth,editarSprint)
    .delete(checkAuth,eliminarSprint)

export default router;