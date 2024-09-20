// perfil.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('perfil.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el perfil');
            }
            return response.json();
        })
        .then(data => {
            const perfilDiv = document.getElementById('perfil');
            perfilDiv.innerHTML = `
                <p><strong>Nombre:</strong> ${data.nombre}</p>
                <p><strong>Correo:</strong> ${data.correo}</p>
                <p><strong>Teléfono:</strong> ${data.telefono ? data.telefono : 'No proporcionado'}</p>
                <p><strong>Dirección:</strong> ${data.direccion ? data.direccion : 'No proporcionado'}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${data.fecha_nacimiento ? data.fecha_nacimiento : 'No proporcionado'}</p>
            `;
        })
        .catch(error => console.error('Error al cargar el perfil:', error));
});
