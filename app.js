let db;


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


async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}


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

document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreRegistro').value;
    const correo = document.getElementById('correoRegistro').value;
    let contraseña = document.getElementById('contraseñaRegistro').value;
ca
    if (!nombre || !correo || !contraseña) {
        document.getElementById('resultado').innerText = 'Todos los campos son obligatorios.';
        return;
    }

    if (!validarCorreo(correo)) {
        document.getElementById('resultado').innerText = 'El formato del correo es inválido.';
        return;
    }

    contraseña = await hashPassword(contraseña);

    const datos = { nombre, correo, contraseña };

    guardarEnIndexedDB(datos);

    enviarAlServidor(datos, 'registro');
});

function validarCorreo(correo) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(correo);
}

document.getElementById('inicioForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const correo = document.getElementById('correoInicio').value;
    let contraseña = document.getElementById('contraseñaInicio').value;

    if (!correo || !contraseña) {
        document.getElementById('resultado').innerText = 'Todos los campos son obligatorios.';
        return;
    }

    if (!validarCorreo(correo)) {
        document.getElementById('resultado').innerText = 'El formato del correo es inválido.';
        return;
    }

    contraseña = await hashPassword(contraseña);

    const datos = { correo, contraseña };

    enviarAlServidor(datos, 'iniciar_sesion');
});

function iniciar_sesion() {
    document.getElementById('inicioForm').style.display = 'block';
    document.getElementById('registroForm').style.display = 'none';
}

function registro_s() {
    document.getElementById('inicioForm').style.display = 'none';
    document.getElementById('registroForm').style.display = 'block';
}
