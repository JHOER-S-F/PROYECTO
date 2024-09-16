<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "root";  // Usuario predeterminado de XAMPP
$password = "";      // Contraseña predeterminada (vacía en XAMPP)
$dbname = "usuarios";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $contraseña = password_hash($_POST['contraseña'], PASSWORD_DEFAULT);  // Encriptar la contraseña

    // Verificar si el correo ya está registrado
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = ?");
    
    if (!$stmt) {
        die("Error en la consulta de selección: " . $conn->error);
    }
    
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "El correo ya está registrado.";
    } else {
        // Preparar la consulta de inserción
        $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)");

        // Verificar si la consulta fue preparada correctamente
        if ($stmt === false) {
            die('Error en la preparación de la consulta INSERT: ' . $conn->error);
        }

        // Vincular parámetros (los tipos de datos: s = string)
        $stmt->bind_param("sss", $nombre, $correo, $contraseña);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo "Registro exitoso. Ahora puedes iniciar sesión.";
        } else {
            echo "Error al registrar: " . $stmt->error;
        }
    }

    // Cerrar la consulta preparada
    $stmt->close();
}

// Cerrar la conexión
$conn->close();
?>

