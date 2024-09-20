function enviarResena(cancha_id, usuario_id) {
    const comentario = document.getElementById(`comentarioCancha${cancha_id}`).value;

    fetch('/api/reseñas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cancha_id,
            usuario_id,
            calificacion: 5, // Asigna una calificación de ejemplo
            comentario,
        }),
    })
    .then(response => {
        if (response.ok) {
            alert('Reseña enviada exitosamente');
            cargarResenas(cancha_id); // Recargar reseñas
        } else {
            alert('Error al enviar la reseña');
        }
    })
    .catch(error => console.error('Error:', error));
}

function cargarResenas(cancha_id) {
    fetch(`/api/reseñas?cancha_id=${cancha_id}`)
        .then(response => response.json())
        .then(data => {
            const listaResenas = document.getElementById(`listaResenasCancha${cancha_id}`);
            listaResenas.innerHTML = '';

            let totalCalificacion = 0;

            data.forEach(resena => {
                const div = document.createElement('div');
                div.innerHTML = `<p>${resena.comentario} - Calificación: ${resena.calificacion}/5</p>`;
                listaResenas.appendChild(div);
                totalCalificacion += resena.calificacion;
            });

            // Calcular promedio
            const promedio = (totalCalificacion / data.length).toFixed(1);
            document.getElementById(`calificacionPromedio${cancha_id}`).textContent = isNaN(promedio) ? 'N/A' : promedio;
        })
        .catch(error => console.error('Error:', error));
}

// Cargar reseñas al inicio
cargarResenas(1); // Cambia el ID según sea necesario
cargarResenas(2); // Cargar reseñas de la Cancha 2
