const {PrismaClient, Prisma} = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

// Busca el usuario según id
const getUsuario = async (req, res) =>{

    const {id_usuario} = req.params
    
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id_usuario)
            }
        })
        res.status(201).json(usuario)
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener el usuario."
        })
    }
}

// Crea un usuario
const createUsuario = async (req, res) =>{

    const {nombre, apellido, fecha_nacimiento, telefono, usuario, contraseña} = req.body

    if(!usuario || !contraseña){
        return res.status(400).json({
            error: "Los campos usuario y contraseña no pueden estar vacíos, son requeridos."
        })
    }

    try {
        const existeUsuario = await prisma.usuario.findUnique({
            where: {
                usuario: usuario
            }
        })

        if(existeUsuario){
            return res.status(400).json({
                error: "El usuario ya existe. Inicie sesión o elija otro nombre."
            })
        }

        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10)
        const usuarioNuevo = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                fecha_nacimiento,
                telefono: parseInt(telefono),
                usuario,
                contraseña: contraseñaEncriptada
            }
        })
        res.status(201).json(usuarioNuevo)
    } catch (error) {
        res.status(500).json({
            error: "Error al crear el usuario."
        })
    }
}

// Autentica un usuario según usuario y contraseña
const autenticarUsuario = async (req, res) => {

    const {usuario, contraseña} = req.body

    if(!usuario){
        return res.status(400).json({
            error: "El usuario a autenticar no puede estar vacío."
        })
    }

    try {
        const existeUsuario = await prisma.usuario.findUnique({
            where: {
                usuario: usuario
            }
        })

        if(!existeUsuario){
            return res.status(404).json({
                error: "El usuario no existe. Verifique sus datos."
            })
        }

        const coincideContraseña = await bcrypt.compare(contraseña, existeUsuario.contraseña)
        if(!coincideContraseña){
            return res.status(404).json({
                error: "Contraseña no válida. Verifique sus datos."
            })
        }

        const usuarioAutenticado = await prisma.usuario.update({
            where: {
                usuario: usuario
            },
            data: {
                autenticado: true
            }
        })
        res.status(201).json(usuarioAutenticado)
    } catch (error) {
        res.status(500).json({
            error: "Error al autenticar un usuario"
        })
    }
}

// Desautentica un usuario según id
const desautenticarUsuario = async (req, res) => {

    const {id_usuario} = req.params

    try {
        const iniciadoSesionUsuario = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id_usuario)
            }
        })

        if(!iniciadoSesionUsuario.autenticado){
            return res.status(404).json({
                error: "No hay usuario para cerrar sesión."
            })
        }

        const usuario = await prisma.usuario.update({
            where: {
                id: parseInt(id_usuario)
            },
            data: {
                autenticado: false
            }
        })
        res.status(201).json(usuario)
    } catch (error) {
        res.status(500).json({
            error: "Error al desautenticar un usuario"
        })
    }
}

module.exports = {
    getUsuario,
    createUsuario,
    autenticarUsuario,
    desautenticarUsuario
}
