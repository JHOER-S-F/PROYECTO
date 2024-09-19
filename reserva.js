document.getElementById('reservaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cancha = document.getElementById('cancha').value;

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
            mostrarResultado('RESERVA CONFIRMADA '+ fecha+'<br>'+hora+'<br>'+cancha);

            // Redirigir al index.html después de 3 segundos si la reserva es exitosa
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            mostrarResultado('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarResultado('Error al procesar la reserva.');
    });
});

function mostrarResultado(mensaje) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.textContent = mensaje;
}
