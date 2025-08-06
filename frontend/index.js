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
