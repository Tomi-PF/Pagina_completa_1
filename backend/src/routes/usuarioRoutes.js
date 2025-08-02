const express = require('express')
const router = express.Router()

const {
    getUsuario,
    createUsuario,
    autenticarUsuario,
    desautenticarUsuario
} = require('../controllers/usuarioController')

router.get('/usuario/:id_usuario', getUsuario)
router.post('/crear/', createUsuario)
router.put('/autenticar/', autenticarUsuario)
router.put('/desautenticar/:id_usuario', desautenticarUsuario)

module.exports = router
