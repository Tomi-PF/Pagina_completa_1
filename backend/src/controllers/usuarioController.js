const {PrismaClient, Prisma} = require('@prisma/client')
const prisma = new PrismaClient()

// Busca el usuario autenticado
const getUsuario = async (req, res) =>{
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                autenticado: true,
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
    const {nombre_nuevo, apellido_nuevo, fecha_nacimiento_nueva, telefono_nuevo, usuario_nuevo, contraseña_nueva} = req.body
    if(!usuario_nuevo || !contraseña_nueva){
        return res.status(400).json({
            error: "Los campos usuario y contraseña no pueden estar vacíos, son requeridos."
        })
    }

    try {
        const existeUsuario = await prisma.usuario.findUnique({
            where: {
                usuario: usuario_nuevo
            }
        })

        if(existeUsuario){
            return res.status(400).json({
                error: "El usuario ya existe. Inicie sesión o elija otro nombre."
            })
        }

        const usuarioNuevo = await prisma.usuario.create({
            data: {
                nombre_nuevo,
                apellido_nuevo,
                fecha_nacimiento_nueva,
                telefono: parseInt(telefono_nuevo),
                usuario_nuevo,
                contraseña_nueva
            }
        })
        res.status(201).json(usuarioNuevo)
    } catch (error) {
        res.status(500).json({
            error: "Error al crear el usuario."
        })
    }
}

// Autentica un usuario
const autenticarUsuario = async (req, res) => {
    const {usuario_validar} = req.body

    if(!usuario_validar){
        return res.status(400).json({
            error: "El usuario a autenticar no puede estar vacío."
        })
    }

    try {
        const existeUsuario = await prisma.usuario.findUnique({
            where: {
                usuario: usuario_validar
            }
        })

        if(!existeUsuario){
            return res.status(404).json({
                error: "El usuario a validar no existe."
            })
        }

        const usuarioAutenticado = await prisma.usuario.update({
            where: {
                usuario: usuario_validar
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

module.exports = {
    getUsuario,
    createUsuario,
    autenticarUsuario
}
