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
