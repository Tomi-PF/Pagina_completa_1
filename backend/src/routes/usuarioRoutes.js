const express = require('express')
const router = express.Router()

const {
    getUsuario,
    createUsuario,
    autenticarUsuario
} = require('../controllers/usuarioController')

router.get('/usuario/', getUsuario)
router.post('/crear/', createUsuario)
router.put('/autenticar/', autenticarUsuario)

module.exports = router
