let db;

// Inicializar IndexedDB
window.onload = function () {
    let request = window.indexedDB.open('miBaseDatos', 1);

    request.onerror = function (event) {
        console.log('Error al abrir la base de datos:', event);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Base de datos abierta:', db);
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        let objectStore = db.createObjectStore('usuarios', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('correo', 'correo', { unique: true });
        console.log('Base de datos creada o actualizada.');
    };
};

// Función para hashear la contraseña usando SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Función para guardar datos en IndexedDB
function guardarEnIndexedDB(datos) {
    let transaction = db.transaction(['usuarios'], 'readwrite');
    let objectStore = transaction.objectStore('usuarios');
    let request = objectStore.add(datos);

    request.onsuccess = function () {
        console.log('Datos guardados en IndexedDB.');
        document.getElementById('resultado').innerText = 'Datos guardados localmente.';
    };

    request.onerror = function (event) {
        console.log('Error al guardar los datos en IndexedDB:', event);
        document.getElementById('resultado').innerText = 'Error al guardar los datos localmente.';
    };
}

// Función para enviar datos al servidor
function enviarAlServidor(datos, endpoint) {
    fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        document.getElementById('resultado').innerText = data;
    })
    .catch(error => {
        console.error('Error al enviar los datos al servidor:', error);
        document.getElementById('resultado').innerText = 'Error al enviar los datos al servidor.';
    });
}

// Manejar el formulario de registro
document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreRegistro').value;
    const correo = document.getElementById('correoRegistro').value;
    let contraseña = document.getElementById('contraseñaRegistro').value;

    // Validación básica
    if (!nombre || !correo || !contraseña) {
        document.getElementById('resultado').innerText = 'Todos los campos son obligatorios.';
        return;
    }

    if (!validarCorreo(correo)) {
        document.getElementById('resultado').innerText = 'El formato del correo es inválido.';
        return;
    }

    // Hashear la contraseña
    contraseña = await hashPassword(contraseña);

    const datos = { nombre, correo, contraseña };

    // Guardar datos en IndexedDB
    guardarEnIndexedDB(datos);

    // Enviar datos al servidor
    enviarAlServidor(datos, 'registro');
});

// Función para validar el formato del correo
function validarCorreo(correo) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(correo);
}

// Manejar el formulario de inicio de sesión
document.getElementById('inicioForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const correo = document.getElementById('correoInicio').value;
    let contraseña = document.getElementById('contraseñaInicio').value;

    // Validación básica
    if (!correo || !contraseña) {
        document.getElementById('resultado').innerText = 'Todos los campos son obligatorios.';
        return;
    }

    if (!validarCorreo(correo)) {
        document.getElementById('resultado').innerText = 'El formato del correo es inválido.';
        return;
    }

    // Hashear la contraseña
    contraseña = await hashPassword(contraseña);

    const datos = { correo, contraseña };

    // Enviar datos al servidor
    enviarAlServidor(datos, 'iniciar_sesion');
});

// Funciones para cambiar entre los formularios
function iniciar_sesion() {
    document.getElementById('inicioForm').style.display = 'block';
    document.getElementById('registroForm').style.display = 'none';
}

function registro_s() {
    document.getElementById('inicioForm').style.display = 'none';
    document.getElementById('registroForm').style.display = 'block';
}





// Geolocalización - Ubicación del usuario
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    console.log("La geolocalización no es soportada por este navegador.");
}

function showPosition(position) {
    const latitud = position.coords.latitude;
    const longitud = position.coords.longitude;
    console.log("Latitud: " + latitud + " Longitud: " + longitud);

    // Aquí podrías actualizar el mapa con la ubicación actual del usuario
    var userLocation = { lat: latitud, lng: longitud };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: userLocation
    });

    var marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Tu ubicación'
    });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("El usuario denegó la solicitud de geolocalización.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("La información de ubicación no está disponible.");
            break;
        case error.TIMEOUT:
            console.log("La solicitud para obtener la ubicación ha caducado.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("Un error desconocido ocurrió.");
            break;
    }
}

// FullCalendar - Renderizado del calendario de disponibilidad
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            {
                title: 'Cancha 1 Reservada',
                start: '2024-09-20T18:00:00'
            },
            {
                title: 'Cancha 2 Reservada',
                start: '2024-09-22T15:00:00'
            }
        ]
    });
    calendar.render();
});

// Función para mostrar alertas de confirmación al reservar una cancha
function confirmarReserva(canchaId) {
    if (confirm("¿Estás seguro de que quieres reservar esta cancha?")) {
        // Lógica para procesar la reserva, como enviar una petición al servidor
        alert("Cancha reservada con éxito.");
    } else {
        alert("Reserva cancelada.");
    }
}

// Escucha eventos para los botones de reserva
document.querySelectorAll('.cancha button').forEach(function (button) {
    button.addEventListener('click', function () {
        const canchaId = this.parentElement.querySelector('h3').innerText;
        confirmarReserva(canchaId);
    });
});

// Validación del formulario de pago
document.querySelector('form[action="/procesar_pago"]').addEventListener('submit', function (event) {
    const numeroTarjeta = document.getElementById('numero_tarjeta').value;
    const expiracion = document.getElementById('expiracion').value;
    const cvv = document.getElementById('cvv').value;

    if (!numeroTarjeta || !expiracion || !cvv) {
        alert("Por favor, completa todos los campos de pago.");
        event.preventDefault();
    } else {
        alert("Pago procesado correctamente.");
    }
});

