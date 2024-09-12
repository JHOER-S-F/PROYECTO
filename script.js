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