// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const util = require('util');
const bcrypt = require('bcrypt');
const fs = require('fs'); // Importar el módulo fs para manejar archivos
const registroRouter = require('./registro'); // Importar el router de registro
const perfilRouter = require('./perfil'); // Importar el router de perfil (si lo tienes)

// Crear la aplicación Express
const app = express();
const port = 3000;

// Habilitar CORS para permitir solicitudes desde otros dominios
app.use(cors());

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto si tienes un usuario diferente
    password: '', // Cambia esto si tienes una contraseña
    database: 'prueba_api' // Nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) throw err; // Lanzar error si no se puede conectar
    console.log('Conectado a la base de datos MySQL!');
});

// Promisificar la consulta de MySQL para facilitar el uso de async/await
const query = util.promisify(connection.query).bind(connection);

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para manejar JSON

// Middleware de validación de entrada para las reservas
const validarReserva = [
    body('fecha_entrada').isDate().withMessage('Fecha de entrada no válida'),
    body('hora_entrada').matches(/^\d{2}:\d{2}$/).withMessage('Hora de entrada no válida'),
    body('hora_salida').matches(/^\d{2}:\d{2}$/).withMessage('Hora de salida no válida'),
    body('cancha').isInt({ min: 1 }).withMessage('Selecciona una cancha válida')
];

// Ruta para manejar las reservas
app.post('/reservar', validarReserva, async (req, res) => {
    const errores = validationResult(req); // Verificar errores de validación
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() }); // Devolver errores si existen
    }

    const { fecha_entrada, hora_entrada, hora_salida, cancha } = req.body;

    try {
        // Consulta para verificar si la cancha ya está reservada en el horario seleccionado
        const checkQuery = `
            SELECT * FROM reservas 
            WHERE cancha = ? 
            AND fecha_entrada = ? 
            AND (
                (hora_entrada < ? AND hora_salida > ?) OR
                (hora_entrada >= ? AND hora_entrada < ?) OR
                (hora_salida > ? AND hora_salida <= ?)
            )
        `;
        const checkValues = [cancha, fecha_entrada, hora_salida, hora_entrada, hora_entrada, hora_salida, hora_entrada, hora_salida];

        const resultados = await query(checkQuery, checkValues);

        if (resultados.length > 0) {
            return res.status(400).json({ error: 'La cancha ya está reservada en el horario seleccionado.' });
        }

        // Insertar la nueva reserva en la base de datos
        const insertQuery = `
            INSERT INTO reservas (fecha_entrada, hora_entrada, hora_salida, cancha) 
            VALUES (?, ?, ?, ?)
        `;
        const insertValues = [fecha_entrada, hora_entrada, hora_salida, cancha];

        await query(insertQuery, insertValues);
        res.json({ message: 'Reserva realizada con éxito!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno al realizar la reserva' });
    }
});

// Ruta para registrar usuario
app.post('/register', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    // Verificar si el correo ya existe
    const checkSql = 'SELECT * FROM users WHERE correo = ?';
    connection.query(checkSql, [correo], (err, results) => {
        if (err) {
            console.error('Error al verificar el correo:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Este correo ya está registrado' });
        }

        // Hash de la contraseña
        bcrypt.hash(contraseña, 10, (err, hash) => {
            if (err) {
                console.error('Error al hash de la contraseña:', err);
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }

            const sql = 'INSERT INTO users (nombre, correo, contraseña) VALUES (?, ?, ?)';
            connection.query(sql, [nombre, correo, hash], (err, result) => {
                if (err) {
                    console.error('Error al registrar el usuario:', err);
                    return res.status(500).json({ error: 'Error al registrar el usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado con éxito' });
            });
        });
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;
    const sql = 'SELECT * FROM users WHERE correo = ?';
    connection.query(sql, [correo], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(contraseña, user.contraseña, (err, isMatch) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err);
                    return res.status(500).json({ error: 'Error al iniciar sesión' });
                }

                if (isMatch) {
                    // Guardar datos del usuario en un archivo JSON
                    const userData = {
                        nombre: user.nombre,
                        correo: user.correo,
                        telefono: user.telefono || null,
                        direccion: user.direccion || null,
                        fecha_nacimiento: user.fecha_nacimiento || null
                    };

                    fs.writeFileSync('perfil.json', JSON.stringify(userData, null, 2), 'utf8');

                    res.status(200).json({ message: 'Inicio de sesión exitoso', user: userData });
                } else {
                    res.status(401).json({ message: 'Credenciales incorrectas' });
                }
            });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para guardar reseñas
app.post('/api/reseñas', (req, res) => {
    const { cancha_id, usuario_id, calificacion, comentario } = req.body;

    const query = 'INSERT INTO reseñas (cancha_id, usuario_id, calificacion, comentario) VALUES (?, ?, ?, ?)';
    connection.query(query, [cancha_id, usuario_id, calificacion, comentario], (error, results) => {
        if (error) {
            return res.status(500).send('Error al guardar la reseña');
        }
        res.status(201).send('Reseña guardada');
    });
});

// Endpoint para obtener reseñas
app.get('/api/reseñas/:cancha_id', (req, res) => {
    const { cancha_id } = req.params;

    const query = 'SELECT * FROM reseñas WHERE cancha_id = ?';
    connection.query(query, [cancha_id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener las reseñas');
        }
        res.json(results);
    });
});

// Middleware global para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal. Por favor, intenta más tarde.' });
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/error'); // Redirigir a una página de error si hay un problema
        }
        res.redirect('/logout.html'); // Redirigir a logout.html
    });
});

// Rutas para el perfil y el registro
app.use('/api/perfil', perfilRouter); 
app.use('/api/registro', registroRouter); // Ruta para el registro

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
