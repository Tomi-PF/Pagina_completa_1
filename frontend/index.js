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
                Boton_info.href = `info_ciudad.html?id=${ciudad.id}`
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
