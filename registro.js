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

// Escuchar el evento submit del formulario de registro
document.getElementById('registroForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Evita que el formulario se envíe automáticamente

    const nombre = document.getElementById('nombreRegistro').value;
    const correo = document.getElementById('correoRegistro').value;
    const contraseña = document.getElementById('contraseñaRegistro').value;

    fetch('registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nombre=${nombre}&correo=${correo}&contraseña=${contraseña}`
    })
    .then(response => response.json())
    .then(data => {
        const resultadoDiv = document.getElementById('resultado');
        if (data.success) {
            resultadoDiv.innerHTML = "Registro exitoso.<br>" + nombre + ", ahora puedes iniciar sesión.";
        } else {
            resultadoDiv.innerHTML = "Error:<br>" + data.message;
        }
    })
    .catch(error => console.error('Error:', error));
});

// Escuchar el evento submit del formulario de inicio de sesión
document.getElementById('inicioForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Evita que el formulario se envíe automáticamente

    const correo = document.getElementById('correoInicio').value;
    const contraseña = document.getElementById('contraseñaInicio').value;

    fetch('inicio_sesion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `correo=${correo}&contraseña=${contraseña}`
    })
    .then(response => response.json())
    .then(data => {
        const resultadoDiv = document.getElementById('resultado');
        if (data.success) {
            // Aquí deberías devolver el nombre del usuario desde el backend
            resultadoDiv.innerHTML = "Inicio de sesión exitoso.<br> Bienvenido <br>" + (data.nombre || 'usuario');
        } else {
            resultadoDiv.innerHTML = "Error:<br>" + data.message;
        }
    })
    .catch(error => console.error('Error:', error));
});


