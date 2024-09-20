const express = require('express');
const connection = require('./db'); // Importa la conexión a MySQL

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
