const express = require('express')
const router = express.Router()

const {
    createUsuario,
    autenticarUsuario,
    desautenticarUsuario
} = require('../controllers/usuarioController')

router.post('/crear/', createUsuario)
router.put('/autenticar/', autenticarUsuario)
router.put('/desautenticar/:id_usuario', desautenticarUsuario)

module.exports = router
