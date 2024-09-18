const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

// Crear la app de express
const app = express();
const saltRounds = 10; // Para el hashing de contraseñas

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Añade tu contraseña si tienes una
    database: 'prueba_api' // Base de datos utilizada para reservas y usuarios
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.log('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// -------------------- FUNCIONALIDAD DE RESERVAS --------------------

// Ruta para realizar una reserva
app.post('/reservar', (req, res) => {
    const { fecha, hora_entrada, hora_salida, cancha } = req.body;

    const sqlVerificar = `
        SELECT * FROM reservas 
        WHERE cancha = ? 
        AND fecha = ? 
        AND (hora_entrada < ? AND hora_salida > ?)
    `;
    
    db.query(sqlVerificar, [cancha, fecha, hora_salida, hora_entrada], (err, result) => {
        if (err) {
            console.error('Error al verificar la reserva:', err);
            res.status(500).send('Error en el servidor al verificar la reserva.');
            return;
        }

        if (result.length > 0) {
            res.status(400).send('La cancha ya está reservada en el rango de tiempo seleccionado.');
        } else {
            const sqlInsertar = 'INSERT INTO reservas (fecha, hora_entrada, hora_salida, cancha) VALUES (?, ?, ?, ?)';
            db.query(sqlInsertar, [fecha, hora_entrada, hora_salida, cancha], (err, result) => {
                if (err) {
                    console.error('Error al insertar la reserva:', err);
                    res.status(500).send('Error en el servidor al insertar la reserva.');
                    return;
                }
                res.status(200).send('Reserva realizada con éxito');
            });
        }
    });
});

// -------------------- FUNCIONALIDAD DE REGISTRO --------------------

// Ruta para el registro de usuarios
app.post('/registro', (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    // Verificar si el correo ya está registrado
    const sqlVerificar = 'SELECT * FROM users WHERE correo = ?';
    db.query(sqlVerificar, [correo], (err, result) => {
        if (err) {
            res.status(500).send('Error en el servidor');
            return;
        }
        if (result.length > 0) {
            res.status(400).send('El correo ya está registrado');
        } else {
            // Hashear la contraseña antes de guardarla
            bcrypt.hash(contraseña, saltRounds, (err, hash) => {
                if (err) {
                    res.status(500).send('Error en el servidor');
                    return;
                }
                // Insertar el nuevo usuario
                const sqlInsertar = 'INSERT INTO users (nombre, correo, contraseña) VALUES (?, ?, ?)';
                db.query(sqlInsertar, [nombre, correo, hash], (err, result) => {
                    if (err) {
                        res.status(500).send('Error al registrar el usuario');
                        return;
                    }
                    res.status(200).send('Usuario registrado con éxito');
                });
            });
        }
    });
});

// -------------------- FUNCIONALIDAD DE INICIO DE SESIÓN --------------------

// Ruta para el inicio de sesión
app.post('/iniciar_sesion', (req, res) => {
    const { correo, contraseña } = req.body;

    // Verificar si el correo existe en la base de datos
    const sqlBuscar = 'SELECT * FROM users WHERE correo = ?';
    db.query(sqlBuscar, [correo], (err, result) => {
        if (err) {
            res.status(500).send('Error en el servidor');
            return;
        }
        if (result.length === 0) {
            res.status(400).send('El correo no está registrado');
        } else {
            // Comparar las contraseñas
            bcrypt.compare(contraseña, result[0].contraseña, (err, coinciden) => {
                if (coinciden) {
                    res.status(200).send('Inicio de sesión exitoso');
                } else {
                    res.status(400).send('Contraseña incorrecta');
                }
            });
        }
    });
});

// -------------------- INICIAR SERVIDOR --------------------
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

