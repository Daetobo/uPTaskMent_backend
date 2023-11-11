import express from "express";
import { registrar,
         autenticar,
         confirmar,
         olvidePassword,
         comprobarToken,
         nuevoPassword,
         perfil
        } from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/',registrar) // Registrar Usuario
router.post('/login',autenticar) // Autenticar User
router.get('/confirmar/:token',confirmar) // Confirmar cuenta
router.post('/olvide-password',olvidePassword) // Enviar token recuperar password
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword) // comprobar token y generar nuevo password

router.get('/perfil',checkAuth,perfil)

export default router;

