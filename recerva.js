document.getElementById('reservaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cancha = document.getElementById('cancha').value;

    // Enviar datos al archivo PHP usando fetch
    fetch('procesar_reserva.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `fecha=${fecha}&hora=${hora}&cancha=${cancha}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarResultado('Reserva confirmada.');
        } else {
            mostrarResultado('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para mostrar el resultado de la reserva
function mostrarResultado(mensaje) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.textContent = mensaje;
}