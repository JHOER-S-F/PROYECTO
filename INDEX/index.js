document.addEventListener("DOMContentLoaded", function() {
  // Selecciona todos los elementos que tienen el atributo data-animate
  const elementsToAnimate = document.querySelectorAll('[data-animate]');

  // Crea un observador de intersección para detectar elementos en la vista
  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          // Si el elemento está en la vista, se añade la clase 'visible'
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, { threshold: 0.1 }); // Umbral de 10% para activar la animación

  // Observa cada elemento que se va a animar
  elementsToAnimate.forEach(element => {
      observer.observe(element);
  });
});

// Función para manejar la rotación de testimonios
document.addEventListener("DOMContentLoaded", function() {
  // Selecciona todos los elementos con la clase 'testimonial'
  const testimonials = document.querySelectorAll('.testimonial');
  let currentIndex = 0; // Índice del testimonio actual

  // Función para cambiar el testimonio visible
  function showNextTestimonial() {
      // Elimina la clase 'visible' del testimonio actual
      testimonials[currentIndex].classList.remove('visible');
      
      // Calcula el siguiente índice (circular)
      currentIndex = (currentIndex + 1) % testimonials.length;
      
      // Añade la clase 'visible' al siguiente testimonio
      testimonials[currentIndex].classList.add('visible');
  }

  // Cambia el testimonio cada 5 segundos
  setInterval(showNextTestimonial, 5000);
  
  // Inicialmente mostrar el primer testimonio
  testimonials[currentIndex].classList.add('visible');
});


// Alternar el menú al hacer clic en la imagen o el ícono
const toggleMenu = () => {
  const menu = document.getElementById('menuItems');
  menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
};

document.getElementById('menuIcon').addEventListener('click', function(e) {
  e.preventDefault();
  toggleMenu();
});

document.getElementById('menuIconImg').addEventListener('click', function() {
  toggleMenu();
});












const express = require('express');
const connection = require('../db'); // Importa la conexión a MySQL

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error del servidor');
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo usuario
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
  connection.query(sql, [name, email, age], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error del servidor');
    }
    res.status(201).json({ id: result.insertId, name, email, age });
  });
});

// Ruta para actualizar un usuario
app.put('/api/users/:id', (req, res) => {
  const { name, email, age } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
  connection.query(sql, [name, email, age, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error del servidor');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json({ id, name, email, age });
  });
});

// Ruta para eliminar un usuario
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error del servidor');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
