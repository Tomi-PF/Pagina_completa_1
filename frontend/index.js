let reservaSeleccionada = null;
const id_ciudad = localStorage.getItem('id_ciudad')
const id_hotel = localStorage.getItem('id_hotel')
let nombre_ciudad = ""
let nombre_hotel = ""

// FUNCIONES DE LA NAVBAR:
function abrir_sesion(){

    if(localStorage.getItem('id_usuario')){
        const boton_inicio_sesion = document.getElementById('in_ses');
        const boton_registrarse = document.getElementById('reg');
        const boton_cerrar_sesion = document.getElementById('c_ses');
        boton_inicio_sesion.style.display = "none";
        boton_registrarse.style.display = "none";
        boton_cerrar_sesion.style.display = "flex";

        const ruta_actual = window.location.pathname;

        if(ruta_actual === '/alojamientos'){
            const boton_crear_ciudades = document.getElementById('crear_ciudades');
            boton_crear_ciudades.style.display = "block";
        }else if(ruta_actual === '/reservas'){
            const boton_gestionar_reservas = document.getElementById('gestionar_reservas');
            const linea_divisoria = document.getElementById('linea_divisoria');
            boton_gestionar_reservas.style.display = "block";
            linea_divisoria.style.display = "flex";
        }else if(ruta_actual === '/info_ciudad'){
            const boton_modificar = document.getElementById('boton-modificar');
            const boton_crear_hoteles = document.getElementById('crear-hoteles');
            boton_modificar.style.display = "block";
            boton_crear_hoteles.style.display = "block";
        }else if(ruta_actual === '/info_hotel'){
            const boton_modificar = document.getElementById('boton-modificar');
            boton_modificar.style.display = "flex";
        }
    }
}

function cerrar_sesion(){

    const id_usuario = localStorage.getItem('id_usuario');
    fetch('http://localhost:3000/api/v1/usuarios/desautenticar/' + id_usuario, {
        method: 'PUT'
    });

    const boton_inicio_sesion = document.getElementById('in_ses');
    const boton_registrarse = document.getElementById('reg');
    const boton_cerrar_sesion = document.getElementById('c_ses');
    boton_inicio_sesion.style.display = "flex";
    boton_registrarse.style.display = "flex";
    boton_cerrar_sesion.style.display = "none";

    const ruta_actual = window.location.pathname;

    if(ruta_actual === '/alojamientos'){
        const boton_crear_ciudades = document.getElementById('crear_ciudades');
        boton_crear_ciudades.style.display = "none";
    }else if(ruta_actual === '/reservas'){
        const boton_gestionar_reservas = document.getElementById('gestionar_reservas');
        const linea_divisoria = document.getElementById('linea_divisoria');
        boton_gestionar_reservas.style.display = "none";
        linea_divisoria.style.display = "none";
    }else if(ruta_actual === '/info_ciudad'){
        const boton_modificar = document.getElementById('boton-modificar');
        const boton_crear_hoteles = document.getElementById('crear-hoteles');
        boton_modificar.style.display = "none";
        boton_crear_hoteles.style.display = "none";
    }else if(ruta_actual === '/info_hotel'){
        const boton_modificar = document.getElementById('boton-modificar');
        boton_modificar.style.display = "none";
    }

    localStorage.removeItem('id_usuario');
}

// FUNCIONES DE LAS SECCINES DE LA PÁGINA:
// Sección "alojamientos"
function crear_card_ciudad() {
    const container = document.getElementById('ciudadesContainer')
    const mensaje = document.getElementById('mensajeError')

    fetch('http://localhost:3000/api/v1/ciudades/')
    .then(response => response.json())
    .then(ciudades => {

        if (ciudades.length === 0) {
            mensaje.innerText = "No hay ciudades disponibles."
            return
        }

        ciudades.forEach(ciudad => {
            
            // Creación Nombre
            const Nombre = document.createElement('p')
            Nombre.setAttribute("class", "city-name")
            Nombre.innerText = ciudad.nombre
            // Creación del Botón para ver mas información
            const Boton_info = document.createElement('a')
            Boton_info.setAttribute("class", "button is-primary is-outlined")
            Boton_info.innerText = "Ver info"
            Boton_info.style.marginBottom = "10px"
            Boton_info.addEventListener('click', () => {
                localStorage.setItem('id_ciudad', parseInt(ciudad.id))
                Boton_info.href = 'info_ciudad.html'
            })
            // Creación del Botón para borrar la ciudad si el usuario inició sesión
            const Boton_borrar = document.createElement('a')
            if(localStorage.getItem('id_usuario')){
                Boton_borrar.setAttribute("class", "button is-danger is-outlined")
                Boton_borrar.innerText = "Borrar ciudad"
                Boton_borrar.addEventListener('click', () => {
                    borrar_ciudad(ciudad.id)
                })
            }
            // Creación del Contenedor
            const Contenedor = document.createElement('div')
            Contenedor.setAttribute("class", "overlay")
            // Creación de la Imagen
            const Imagen = document.createElement('img')
            Imagen.setAttribute("src", ciudad.foto_ciudad)
            Imagen.setAttribute("class", "alojamiento-img")
            // Creación de la Estructura
            const Estructura = document.createElement('figure')
            Estructura.setAttribute("class", "image")
            // Creación de la Card
            const Card = document.createElement('div')
            Card.setAttribute("class", "card alojamiento-card")
            // Creación de las columnas
            const Columnas = document.createElement('div')
            Columnas.setAttribute("class", "column is-4")
            

            Contenedor.appendChild(Nombre)
            Contenedor.appendChild(Boton_info)
            Contenedor.appendChild(Boton_borrar)
            Estructura.appendChild(Imagen)
            Estructura.appendChild(Contenedor)
            Card.appendChild(Estructura)
            Columnas.appendChild(Card)
            container.appendChild(Columnas)
        });
    })
}

function borrar_ciudad(id) {

    const container = document.getElementById('ciudadesContainer')

    fetch('http://localhost:3000/api/v1/ciudades/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(ciudad => {
        alert(`La ciudad ${ciudad.nombre} ha sido borrada`)
        container.innerText = ''
        crear_card_ciudad()
    })
}

// Sección "crear_ciudades" y "crear_hoteles"        
function enviar_datos(){

    const ruta_actual = window.location.pathname;

    if(ruta_actual === '/crear_ciudades'){

        const formularioCiudad = document.getElementById('formCrearCiudad')

        formularioCiudad.addEventListener('submit', (event) => {
            event.preventDefault()

            const nombre_ciudad = document.getElementById('nombre_ciudad').value;
            const foto_ciudad = document.getElementById('foto_ciudad').value;
            const provincia_ciudad = document.getElementById('provincia_ciudad').value;
            const tamaño_ciudad = document.getElementById('tamaño_ciudad').value;
            const año_fundación = document.getElementById('año_fundación').value;

            let datos_creacion = {
                nombre: nombre_ciudad,
                foto_ciudad: foto_ciudad,
                provincia: provincia_ciudad,
                tamaño: parseFloat(tamaño_ciudad),
                año_fundacion: parseInt(año_fundación)
            };

            fetch('http://localhost:3000/api/v1/ciudades/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos_creacion)
            })
            .then(response => {
                if (response.status === 201) {
                    alert("Ciudad creada con éxito");
                } else {
                    alert("No se pudo crear la ciudad");
                }
            })
        })

    }else if(ruta_actual === '/crear_hoteles'){

        const id = localStorage.getItem('id_ciudad')
        const formularioHotel = document.getElementById('formCrearHotel')

        formularioHotel.addEventListener('submit', (event) => {
            event.preventDefault()

            // Rellena el campo de ciudad con el ID de la ciudad seleccionada
            document.getElementById('id_ciudad').value = id;

            const nombre_hotel = document.getElementById('nombre_hotel').value;
            const foto_hotel = document.getElementById('foto_hotel').value;
            const cant_estrellas = document.getElementById('cant_estrellas').value;
            const cant_habitaciones = document.getElementById('cant_habitaciones').value;
            const precio_noche = document.getElementById('precio_noche').value;
            const calle = document.getElementById('calle').value;
            const num_calle = document.getElementById('num_calle').value;
            const telefono = document.getElementById('telefono').value;
            const id_ciudad = document.getElementById('id_ciudad').value;

            let datos_creacion = { 
                nombre: nombre_hotel,
                foto_hotel: foto_hotel,
                id_ciudad: parseInt(id_ciudad),
                cant_estrellas: parseInt(cant_estrellas),
                cant_habitaciones: parseInt(cant_habitaciones),
                precio_noche: parseInt(precio_noche),
                calle: calle,
                num_calle: parseInt(num_calle),
                telefono: parseInt(telefono)
            };
            console.log(datos_creacion)

            fetch('http://localhost:3000/api/v1/hoteles/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos_creacion)
            })
            .then(response => {
                if (response.status === 201) {
                    alert("Hotel creado con éxito");
                } else {
                    alert("No se pudo crear el hotel");
                }
            });
        })
    }
}

// Sección "editar_reserva"
function cargar_datos_reserva(){
    const reservaId = localStorage.getItem('id_reserva')
    configurarCambioCiudad()
    cargarDatosReserva(reservaId)
}

function editar_datos_reserva(){
    const reservaId = localStorage.getItem('id_reserva')
    const formularioReserva = document.getElementById('formEditarReserva')

    formularioReserva.addEventListener('submit', (event) => {
        event.preventDefault()
        const datosReserva = {
            nombre_completo: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            numero_contacto: parseInt(document.getElementById('numContacto').value.trim(), 10),
            id_ciudad: parseInt(document.getElementById('seleccionar-ciudad').value, 10),
            id_hotel: parseInt(document.getElementById('seleccionar-hotel').value, 10),
            cant_personas: parseInt(document.getElementById('numero').value, 10),
            cant_habitaciones: parseInt(document.getElementById('numero2').value, 10),
            fecha_ingreso: document.getElementById('fecha-entrada').value,
            fecha_salida: document.getElementById('fecha-salida').value
        }

        try {
            fetch('http://localhost:3000/api/v1/reservas/' + reservaId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosReserva)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(errorData.error || 'Error al actualizar la reserva')
                }
                return response.json()
            })

            alert('Reserva actualizada con éxito')
            window.location.href = 'gestionar_reservas.html'
            
        } catch (error) {
            console.error('Error al actualizar la reserva:', error)
            alert('Error al actualizar la reserva: ' + error.message)
        }
    })
}

function seleccionarOpcion(selectId, valueToSelect) {
    const selectElement = document.getElementById(selectId)
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value == valueToSelect) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}

function cargarCiudades(callback) {
    const opciones_ciudad = document.getElementById('seleccionar-ciudad')
    // Limpia el select
    opciones_ciudad.innerHTML = '<option value="" disabled selected>Ciudad destino</option>'

    fetch('http://localhost:3000/api/v1/ciudades/')
    .then(response => response.json())
    .then(ciudades => {
        ciudades.forEach(ciudad => {
            const option = document.createElement('option')
            option.innerText = ciudad.nombre
            option.value = ciudad.id
            opciones_ciudad.appendChild(option)
        })
        if (typeof callback === 'function') callback()
    })
    .catch(error => console.error('Error al cargar ciudades:', error))
}

function configurarCambioCiudad() {
    const opciones_ciudad = document.getElementById('seleccionar-ciudad');
    const opciones_hotel = document.getElementById('seleccionar-hotel');
    
    opciones_ciudad.onchange = () => {
        const opcion_elegida = opciones_ciudad.options[opciones_ciudad.selectedIndex]
        const nombreCiudad = opcion_elegida.innerText
        const id_ciudad = opcion_elegida.value
        
        opciones_hotel.innerHTML = '<option value="" disabled selected>Hotel</option>'
        fetch('http://localhost:3000/api/v1/hoteles/' + encodeURIComponent(nombreCiudad) + '/' + id_ciudad)
        .then(response => response.json())
        .then(hoteles => {
            hoteles.forEach(hotel => {
                const option = document.createElement('option')
                option.innerText = hotel.nombre
                option.value = hotel.id
                opciones_hotel.appendChild(option)
            })
        })
        .catch(error => console.error('Error al cargar hoteles:', error))
    }
}

function cargarDatosReserva(reservaId) {
    try {
        fetch('http://localhost:3000/api/v1/reservas/' + reservaId)
        .then(response => {
            if(!response.ok){
                throw new Error('No se pudo obtener la reserva')
            }
            return response.json()
        })
        .then(reserva => {
            document.getElementById('nombre').value = reserva.nombre_completo
            document.getElementById('email').value = reserva.email
            document.getElementById('numContacto').value = reserva.numero_contacto
            document.getElementById('numero').value = reserva.cant_personas
            document.getElementById('numero2').value = reserva.cant_habitaciones
            document.getElementById('fecha-entrada').value = reserva.fecha_ingreso
            document.getElementById('fecha-salida').value = reserva.fecha_salida

            // Carga opciones de ciudades y selecciona la ciudad correcta
            cargarCiudades(() => {
                seleccionarOpcion('seleccionar-ciudad', reserva.id_ciudad)
                
                const ciudadSelect = document.getElementById('seleccionar-ciudad')
                ciudadSelect.dispatchEvent(new Event('change'))

                // Espera un poco hasta que se carguen los hoteles
                setTimeout(() => {
                    seleccionarOpcion('seleccionar-hotel', reserva.id_hotel)
                }, 500)
            })
        })

    } catch (error) {
        console.error('Error al cargar la reserva:', error)
        alert('Error al cargar la reserva. Redirigiendo a la lista de reservas.')
        window.location.href = 'gestionar_reservas.html' // Redirige a la página anterior
    }
}

// Sección "gestionar_reservas"
function cargarReservas() {
    try {
        fetch('http://localhost:3000/api/v1/reservas')
        .then(response => response.json())
        .then(reservas => {
            renderizarReservas(reservas)
        })

    } catch (error) {
        console.error('Error:', error)
        alert('Error al cargar reservas')
    }
}

function renderizarReservas(reservas) {
    const contenedor = document.getElementById('lista-reservas')
    contenedor.innerHTML = ''

    reservas.forEach(reserva => {
        const reservaElement = document.createElement('div')
        reservaElement.className = 'reserva-item'
        
        reservaElement.innerHTML = `
            <p><strong>ID:</strong> ${reserva.id}</p>
            <p><strong>Nombre:</strong> ${reserva.nombre_completo}</p>
            <p><strong>Ciudad:</strong> ${reserva.ciudad.nombre}</p>
            <p><strong>Hotel:</strong> ${reserva.hotel.nombre}</p>
        `;
        
        reservaElement.addEventListener('click', () => abrirModal(reserva))
        contenedor.appendChild(reservaElement)
    });
}

function abrirModal(reserva) {
    reservaSeleccionada = reserva;
    const modal = document.getElementById('modal-reserva')

    modal.style.display = 'flex'

    // Número de reserva
    document.getElementById('modal-titulo').innerHTML = `<strong>Reserva #${reserva.id}</strong>`
    localStorage.setItem('id_reserva', parseInt(reserva.id))
    
    // Detalles de la reserva
    document.getElementById('modal-info').innerHTML = `
        <p><strong>Email:</strong> ${reserva.email}</p>
        <p><strong>Contacto:</strong> ${reserva.numero_contacto}</p>
        <p><strong>Personas:</strong> ${reserva.cant_personas}</p>
        <p><strong>Habitaciones:</strong> ${reserva.cant_habitaciones}</p>
        <p><strong>Fecha de ingreso:</strong> ${reserva.fecha_ingreso}</p>
        <p><strong>Fecha de salida:</strong> ${reserva.fecha_salida}</p>
    `
}

function cerrar_modal(){
    document.getElementById('modal-reserva').style.display = 'none'
}

function editar_reserva(){
    window.location.href = 'editar_reserva.html'
}

function eliminar_reserva(){

    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
        try {
            fetch('http://localhost:3000/api/v1/reservas/' + reservaSeleccionada.id, {
                method: 'DELETE'
            })
            .then(response => {

                if(response.ok){
                    alert('Reserva eliminada')
                    document.getElementById('modal-reserva').style.display = 'none'
                    cargarReservas()
                }
            })
            
        } catch (error) {
            console.error('Error:', error)
            alert('Error al eliminar reserva')
        }
    }
}

// Sección "info_ciudad"
function crear_info_ciudad() {

    const id = localStorage.getItem('id_ciudad')

    fetch('http://localhost:3000/api/v1/ciudades/' + parseInt(id))
    .then(response => response.json())
    .then(ciudad => {
        const titulo = document.getElementById('titulo-ciudad')
        titulo.innerText = `Información de la ciudad: ${ciudad.nombre}`

        const foto = document.getElementById('foto-ciudad')
        foto.setAttribute("src", ciudad.foto_ciudad)
        foto.setAttribute("alt", `Imagen de la ciudad de ${ciudad.nombre}`)
        
        const boton_modificar = document.getElementById("boton-modificar")
        boton_modificar.setAttribute("class", "button is-primary is-outlined")
        boton_modificar.addEventListener('click', () => {
            boton_modificar.href = 'modificar_ciudad.html'
        })

        const datos = document.getElementById('datos-ciudad')
        datos.innerText = `La ciudad de ${ciudad.nombre} se encuenta en la provincia de ${ciudad.provincia}. Fue fundada en el año ${ciudad.año_fundacion} y tiene un tamaño de ${ciudad.tamaño} km²`
    })
}

function crear_hotel(){
    window.location.href = 'crear_hoteles.html'
}

function ver_hoteles(){
    window.location.href = 'ver_hoteles.html'
}

// Sección "info_hotel"
function obtener_info_hotel(){
    const id = localStorage.getItem('id_hotel')

    fetch(`http://localhost:3000/api/v1/hoteles/${id}`)
    .then(response => response.json())
    .then(hotel => {
        const titulo = document.getElementById('titulo-hotel')
        titulo.innerText = `Información del hotel: ${hotel.nombre}`

        const foto = document.getElementById('foto-hotel')
        foto.setAttribute('src', hotel.foto_hotel)
        foto.setAttribute('alt', `Imagen del hotel ${hotel.nombre}`)

        const datos = document.getElementById('datos-hotel')
        datos.innerText = `Dirección: ${hotel.calle} ${hotel.num_calle}. Habitaciones: ${hotel.cant_habitaciones}.`

        const boton_modificar = document.getElementById("boton-modificar")
        localStorage.setItem('id_hotel', hotel.id)
        boton_modificar.setAttribute("href", 'modificar_hotel.html')
    })
}

// Sección "iniciar_sesion"
function iniciar_sesion(){
    const formularioUsuario = document.getElementById('formInicioSesion')

    formularioUsuario.addEventListener('submit', (event) =>{
        event.preventDefault()

        const usuario = document.getElementById('usuario').value.trim()
        const contraseña = document.getElementById('password').value.trim()

        const usuario_autenticar = {
            usuario: usuario,
            contraseña: contraseña
        }

        fetch('http://localhost:3000/api/v1/usuarios/autenticar/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario_autenticar)
        })
        .then(response => {
            if(!response.ok){
                return response.json().then(errorData =>{
                    const contenedor_mensaje = document.getElementById('mensaje_error')
                    contenedor_mensaje.style.display = "flex"
                    const contenedor_texto = document.getElementById('mensaje')
                    contenedor_texto.innerText = errorData.error
                    throw new Error(errorData.error || 'Error al autenticar el usuario')
                })
            }
            return response.json()
        })
        .then(data => {
            formularioUsuario.reset()

            const contenedor_mensaje = document.getElementById('mensaje_error')
            contenedor_mensaje.style.display = "none"
            const boton_inicio_sesion = document.getElementById('in_ses')
            boton_inicio_sesion.style.display = "none"
            const boton_registrarse = document.getElementById('reg')
            boton_registrarse.style.display = "none"
            const boton_cerrar_sesion = document.getElementById('c_ses')
            boton_cerrar_sesion.style.display = "flex"

            localStorage.setItem('id_usuario', parseInt(data.id))
            window.location.href = 'http://localhost:8000/'
        })
    })
}

function eliminar_mensaje(){
    const mensaje_error = document.getElementById('mensaje_error')
    mensaje_error.style.display = "none"
}

// Sección "modificar_ciudad"
function cargar_datos_ciudad(){

    fetch('http://localhost:3000/api/v1/ciudades/' + parseInt(id_ciudad))
    .then(response => response.json())
    .then(ciudad => {
        nombre_ciudad = ciudad.nombre
        const titulo = document.getElementById('titulo-ciudad')
        titulo.innerText = `Modificar datos de: ${ciudad.nombre}`

        console.log(ciudad.foto_ciudad)
        document.getElementById('foto-ciudad').value = ciudad.foto_ciudad
        document.getElementById('provincia-ciudad').value = ciudad.provincia
        document.getElementById('tamaño-ciudad').value = ciudad.tamaño
        document.getElementById('año-fundación').value = ciudad.año_fundacion
    })
}

function enviar_datos_ciudad(){

    const formularioCiudad = document.getElementById('formModificarCiudad')
    
    formularioCiudad.addEventListener('submit', (event) => {
        event.preventDefault()
        
        const foto_ciudad = document.getElementById('foto-ciudad').value;
        const provincia_ciudad = document.getElementById('provincia-ciudad').value;
        const tamaño_ciudad = document.getElementById('tamaño-ciudad').value;
        const año_fundación = document.getElementById('año-fundación').value;

        let datos_creacion = {
            id: parseInt(id_ciudad),
            nombre: nombre_ciudad.trim(),
            foto_ciudad: foto_ciudad.trim(),
            provincia: provincia_ciudad.trim(),
            tamaño: parseFloat(tamaño_ciudad),
            año_fundacion: parseInt(año_fundación)
        };

        fetch('http://localhost:3000/api/v1/ciudades/' + parseInt(id_ciudad), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos_creacion)
        }).then(response => {
            if (response.ok) {
                alert(`Ciudad ${nombre_ciudad} modificada con éxito`)
                window.location.href = 'http://localhost:8000/info_ciudad'
            }
            else {
                alert('Error al modificar la ciudad')
            }
        });
    })
}

// Sección "modificar_hotel"
function obtener_nombre_hotel(){

    fetch('http://localhost:3000/api/v1/hoteles/' + id_hotel)
    .then(response => response.json())
    .then(hotel => {
        nombre_hotel = hotel.nombre
    })
}

function cargar_datos_hotel(){

    fetch('http://localhost:3000/api/v1/hoteles/' + id_hotel)
    .then(response => response.json())
    .then(hotel => {
        console.log(hotel)
        document.getElementById('foto-hotel').value = hotel.foto_hotel
        document.getElementById('cant-estrellas').value = hotel.cant_estrellas
        document.getElementById('cant-habitaciones').value = hotel.cant_habitaciones
        document.getElementById('precio-noche').value = hotel.precio_noche
        document.getElementById('calle').value = hotel.calle
        document.getElementById('num-calle').value = hotel.num_calle
        document.getElementById('tel').value = hotel.telefono
        
    })
}

function enviar_datos_hotel(){

    const formularioHotel = document.getElementById('formModificarHotel')

    formularioHotel.addEventListener('submit', (event) => {
        event.preventDefault()
        
        const foto_hotel = document.getElementById('foto-hotel').value;
        const cant_estrellas = document.getElementById('cant-estrellas').value;
        const cant_habitaciones = document.getElementById('cant-habitaciones').value;
        const precio_noche = document.getElementById('precio-noche').value;
        const calle = document.getElementById('calle').value;
        const num_calle = document.getElementById('num-calle').value;
        const telefono = document.getElementById('tel').value;

        let datos_modificacion = {
            id: parseInt(id_hotel),
            nombre: nombre_hotel,
            foto_hotel: foto_hotel.trim(),
            id_ciudad: parseInt(id_ciudad),
            cant_estrellas: parseInt(cant_estrellas),
            cant_habitaciones: parseInt(cant_habitaciones),
            precio_noche: parseInt(precio_noche),
            calle: calle.trim(),
            num_calle: parseInt(num_calle),
            telefono: parseInt(telefono)
        };

        fetch('http://localhost:3000/api/v1/hoteles/' + parseInt(id_hotel), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos_modificacion)
        }).then(response => {
            if (response.ok) {
                alert(`Hotel ${nombre_hotel} modificado con éxito`)
                window.location.href = 'http://localhost:8000/info_hotel'
            }
            else {
                alert('Error al modificar el hotel')
            }
        });
    })
}

// Sección "registrarse"
function registrarse(){
    // Selecciona el formulario
    const formularioUsuario = document.getElementById('formRegistro')

    // Al enviar el formulario
    formularioUsuario.addEventListener('submit', (event) => {
        event.preventDefault()

        // Obtención de los datos de nuevo usuario
        const nombre_nuevo = document.getElementById('nombre').value.trim()
        const apellido_nuevo = document.getElementById('apellido').value.trim()
        const fecha_nueva = document.getElementById('fecha').value.trim()
        const email_nuevo = document.getElementById('email').value.trim()
        const telefono_nuevo = document.getElementById('telefono').value.trim()
        const usuario_nuevo = document.getElementById('usuario').value.trim()
        const contraseña_nueva = document.getElementById('password').value.trim()

        const datosUsuario = {
            nombre: nombre_nuevo,
            apellido: apellido_nuevo,
            fecha_nacimiento: fecha_nueva,
            email: email_nuevo,
            telefono: telefono_nuevo,
            usuario: usuario_nuevo,
            contraseña: contraseña_nueva
        }

        fetch('http://localhost:3000/api/v1/usuarios/crear/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        })
        .then(response => {
            if(!response.ok){
                return response.json().then(errorData => {
                    const contenedor_mensaje = document.getElementById('mensaje_error')
                    contenedor_mensaje.style.display = "flex"
                    const contenedor_texto = document.getElementById('mensaje')
                    contenedor_texto.innerText = errorData.error
                    throw new Error(errorData.error || "Error al crear el usuario.")
                })
            }
            return response.json()
        })
        .then(() => {
            formularioUsuario.reset()
            window.location.href = "http://localhost:8000/iniciar_sesion"
        })
    })
}

// Sección "reservas"
function crear_reserva(){
    // Selecciona el form
    const formReserva = document.getElementById('formReserva')

    // Al apretar en submit
    formReserva.addEventListener('submit', (event) => {
        event.preventDefault()

        // Recopila los valores ingresados en cada campo
        const nombre = document.getElementById('nombre').value.trim()
        const email = document.getElementById('email').value.trim()
        const numContacto = document.getElementById('numContacto').value.trim()

        const ciudadSelect = document.getElementById('seleccionar-ciudad')
        const hotelSelect = document.getElementById('seleccionar-hotel')
        const ciudadId = ciudadSelect.value; 
        const hotelId = hotelSelect.value;

        const cantPersonas = document.getElementById('numero').value
        const cantHabitaciones = document.getElementById('numero2').value
        const fechaIngreso = document.getElementById('fecha-entrada').value
        const fechaSalida = document.getElementById('fecha-salida').value
    
        const datosReserva = {
            nombre_completo: nombre,
            email: email,
            numero_contacto: parseInt(numContacto, 10),
            id_ciudad: parseInt(ciudadId, 10),
            id_hotel: parseInt(hotelId, 10),
            cant_personas: parseInt(cantPersonas, 10),
            cant_habitaciones: parseInt(cantHabitaciones, 10),
            fecha_ingreso: fechaIngreso,
            fecha_salida: fechaSalida
        }

        fetch('http://localhost:3000/api/v1/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosReserva)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Error al crear la reserva')
                })
            }
            return response.json()
        })
        .then( data => {
            console.log('Reserva creada:', data)
            alert('Reserva creada con éxito')
            window.location.href = 'http://localhost:8000/gestionar_reservas'
            formReserva.reset()
        })
        .catch( error => {
            console.error('Error al crear la reserva:', error)
            alert('Hubo un error al crear la reserva: ' + error.message)
        })
    })
}

function opciones_reserva(opcion) {

    const opciones_ciudad = document.getElementById('seleccionar-ciudad')
    const opciones_hotel = document.getElementById('seleccionar-hotel')

    fetch('http://localhost:3000/api/v1/ciudades/')
    .then(response => response.json())
    .then(ciudades => {

        if (opcion == "Crear opciones ciudades"){
            
            ciudades.forEach(ciudad => {
        
                const ciudad_opcion = document.createElement('option')
                ciudad_opcion.innerText = ciudad.nombre
                ciudad_opcion.value = ciudad.id
                opciones_ciudad.appendChild(ciudad_opcion)

            })

        } else if(opcion == "Crear opciones hoteles") {

            opciones_ciudad.addEventListener('change', () => {

                const opcion_elegida_ciudad = opciones_ciudad.options[opciones_ciudad.selectedIndex]
                const nombreCiudad = opcion_elegida_ciudad.innerText
                const id_ciudad = opcion_elegida_ciudad.value
                opciones_hotel.innerText = ''

                fetch('http://localhost:3000/api/v1/hoteles/' + nombreCiudad + '/' + id_ciudad)
                .then(response => response.json())
                .then(hoteles => {
                    
                    hoteles.forEach(hotel => {
                        
                        const hotel_opcion = document.createElement('option')
                        hotel_opcion.innerText = hotel.nombre
                        hotel_opcion.value = hotel.id
                        opciones_hotel.appendChild(hotel_opcion)

                    })
                })
            })
        }
    })
}

// Sección "ver_hoteles"
function crear_card_hotel() {
    const container = document.getElementById('hotelesContainer')
    const mensaje = document.getElementById('mensajeError')

    fetch('http://localhost:3000/api/v1/hoteles/' + id_ciudad + '/hoteles' )
    .then(response => response.json())
    .then(hoteles => {
            
        console.log(hoteles)
        if (hoteles.length === 0) {
            mensaje.innerText = "No hay hoteles disponibles."
            return
        }

        hoteles.forEach(hotel => {
            
            // Creación Nombre
            const Nombre = document.createElement('p')
            Nombre.setAttribute("class", "city-name")
            Nombre.innerText = hotel.nombre
            // Info del hotel
            const Boton_info = document.createElement('a')
            Boton_info.setAttribute("class", "button is-primary is-outlined")
            Boton_info.innerText = "Ver info"
            Boton_info.style.marginBottom = "10px"
            Boton_info.addEventListener('click', () => {
                localStorage.setItem('id_hotel', parseInt(hotel.id))
                Boton_info.href = 'info_hotel.html'
            })
            const Boton_borrar = document.createElement('a')
            if(localStorage.getItem('id_usuario')){
                // Creación del Botón para borrar el hotel
                Boton_borrar.setAttribute("class", "button is-danger is-outlined")
                Boton_borrar.innerText = "Borrar hotel"
                Boton_borrar.addEventListener('click', () => {
                    borrar_hotel(hotel.id)
                })
            }
            // Creación del Contenedor
            const Contenedor = document.createElement('div')
            Contenedor.setAttribute("class", "overlay")
            // Creación de la Imagen
            const Imagen = document.createElement('img')
            Imagen.setAttribute("src", hotel.foto_hotel)
            Imagen.setAttribute("class", "alojamiento-img")
            // Creación de la Estructura
            const Estructura = document.createElement('figure')
            Estructura.setAttribute("class", "image")
            // Creación de la Card
            const Card = document.createElement('div')
            Card.setAttribute("class", "card alojamiento-card")
            // Creación de las columnas
            const Columnas = document.createElement('div')
            Columnas.setAttribute("class", "column is-4")
            

            Contenedor.appendChild(Nombre)
            Contenedor.appendChild(Boton_info)
            Contenedor.appendChild(Boton_borrar)
            Estructura.appendChild(Imagen)
            Estructura.appendChild(Contenedor)
            Card.appendChild(Estructura)
            Columnas.appendChild(Card)
            container.appendChild(Columnas)
        });
    })
}

function borrar_hotel(id) {

    const container = document.getElementById('hotelesContainer')

    fetch('http://localhost:3000/api/v1/hoteles/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(hotel => {
        alert(`El hotel ${hotel.nombre} ha sido borrado`)
        container.innerText = ''
        crear_card_hotel()
    })
}
