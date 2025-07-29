const express = require('express')
const router = express.Router()

const {
    getUsuario,
    createUsuario,
    autenticarUsuario
} = require('../controllers/usuarioController')

router.get('/', getUsuario)
router.post('/', createUsuario)
router.put('/', autenticarUsuario)

module.exports = router
