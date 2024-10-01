var registros, inicio, registro, caja_sesion, caja_registro;

window.onload = function() {
    registros = document.querySelector(".caja_registros");
    inicio = document.querySelector(".inicio");
    registro = document.querySelector(".registro");
    caja_sesion = document.querySelector(".caja_sesion");
    caja_registro = document.querySelector(".caja_registro");

    window.addEventListener("resize", ajustarVistaSegunAncho);
    ajustarVistaSegunAncho();
};

function ajustarVistaSegunAncho() {
    if (window.innerWidth > 850) {
        caja_registro.style.display = "block";
        caja_sesion.style.display = "block";
    } else {
        caja_registro.style.display = "block";
        caja_sesion.style.display = "none";
        inicio.style.display = "block";
        registro.style.display = "none";
        registros.style.left = "0px";
    }
};

function iniciar_sesion() {
    inicio.style.display = "block";
    registro.style.display = "none";
    registros.style.left = window.innerWidth > 850 ? "10px" : "0px";
    caja_registro.style.opacity = "1";
    caja_sesion.style.opacity = "0";
};

function registrar() {
    registros.style.left = window.innerWidth > 850 ? "410px" : "0px";
    registro.style.display = "block";
    inicio.style.display = "none";
    caja_registro.style.opacity = "0";
    caja_sesion.style.opacity = "1";
};

async function iniciarSesion(event) {
    event.preventDefault();
    
    const correo = document.getElementById('correoInicio').value;
    const contraseña = document.getElementById('contraseñaInicio').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contraseña })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // Redirigir a usuario.html después de un inicio de sesión exitoso
            window.location.href = '/USUARIO/usuario.html';
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al comunicarse con el servidor');
    }
};

async function registrarUsuario(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombreRegistro').value;
    const correo = document.getElementById('correoRegistro').value;
    const contraseña = document.getElementById('contraseñaRegistro').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, correo, contraseña })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // Puedes redirigir o limpiar el formulario aquí
        } else {
            alert(data.message || 'Error al registrarse');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al comunicarse con el servidor');
    }
};




