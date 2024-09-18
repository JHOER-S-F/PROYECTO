var registros = document.querySelector(".caja_registros");
var inicio = document.querySelector(".inicio");
var registro = document.querySelector(".registro");
var caja_sesion = document.querySelector(".caja_sesion");
var caja_registro = document.querySelector(".caja_registro");

window.addEventListener("resize", anchopagina);

function anchopagina() {
    if (window.innerWidth > 850) {
        caja_registro.style.display = "block";
        caja_sesion.style.display = "block";
    } else {
        caja_registro.style.display = "block";
        caja_registro.style.opacity = "1";
        caja_sesion.style.display = "none";
        inicio.style.display = "block";
        registro.style.display = "none";
        registros.style.left = "0px";
    }
}

anchopagina();

function iniciar_sesion() {
    if (window.innerWidth > 850) {
        inicio.style.display = "block";
        registro.style.display = "none";
        registros.style.left = "10px";
        caja_registro.style.opacity = "1";
        caja_sesion.style.opacity = "0";
    } else {
        inicio.style.display = "block";
        registro.style.display = "none";
        caja_registro.style.display = "block";
        caja_sesion.style.display = "none";
        registros.style.left = "0px";
    }
}

function registro_s() {
    if (window.innerWidth > 850) {
        registros.style.left = "410px";
        registro.style.display = "block";
        inicio.style.display = "none";
        caja_registro.style.opacity = "0";
        caja_sesion.style.opacity = "1";
    } else {
        registro.style.display = "block";
        inicio.style.display = "none";
        caja_registro.style.display = "none";
        caja_sesion.style.display = "block";
        caja_sesion.style.opacity = "1";
    }
}

// Función para hashear la contraseña usando SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Validación del correo
function validarCorreo(correo) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(correo);
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    const resultado = document.getElementById('resultado');
    resultado.innerText = mensaje;
    resultado.style.color = 'red';
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    const resultado = document.getElementById('resultado');
    resultado.innerText = mensaje;
    resultado.style.color = 'green';
}

// Manejar el formulario de registro
document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreRegistro').value;
    const correo = document.getElementById('correoRegistro').value;
    let contraseña = document.getElementById('contraseñaRegistro').value;

    // Validación básica
    if (!nombre || !correo || !contraseña) {
        mostrarError('Todos los campos son obligatorios.');
        return;
    }

    if (!validarCorreo(correo)) {
        mostrarError('El formato del correo es inválido.');
        return;
    }

    // Hashear la contraseña
    contraseña = await hashPassword(contraseña);

    const datos = { nombre, correo, contraseña };

    // Enviar datos al servidor
    fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.text())
    .then(data => {
        mostrarExito(data);
    })
    .catch(error => {
        mostrarError('Error al enviar los datos al servidor: ' + error.message);
    });
});

// Manejar el formulario de inicio de sesión
document.getElementById('inicioForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const correo = document.getElementById('correoInicio').value;
    let contraseña = document.getElementById('contraseñaInicio').value;

    // Validación básica
    if (!correo || !contraseña) {
        mostrarError('Todos los campos son obligatorios.');
        return;
    }

    if (!validarCorreo(correo)) {
        mostrarError('El formato del correo es inválido.');
        return;
    }

    // Hashear la contraseña
    contraseña = await hashPassword(contraseña);

    const datos = { correo, contraseña };

    // Enviar datos al servidor
    fetch('http://localhost:3000/iniciar_sesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.text())
    .then(data => {
        mostrarExito(data);
    })
    .catch(error => {
        mostrarError('Error al enviar los datos al servidor: ' + error.message);
    });
});

// Transiciones entre formularios
function iniciar_sesion() {
    document.getElementById('inicioForm').style.display = 'block';
    document.getElementById('registroForm').style.display = 'none';
    registros.style.transition = 'left 0.5s ease';
}

function registro_s() {
    document.getElementById('inicioForm').style.display = 'none';
    document.getElementById('registroForm').style.display = 'block';
    registros.style.transition = 'left 0.5s ease';
}


