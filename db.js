const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', // o '127.0.0.1'
  user: 'root',      // tu usuario de MySQL en XAMPP
  password: '',      // tu contraseña de MySQL (déjala vacía si no tienes)
  database: 'prueba_api' // nombre de tu base de datos
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});

module.exports = connection;
