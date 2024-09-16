<?php
include 'config.php'; // Incluir la configuración de conexión

// Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];
    $contraseña = $_POST['contraseña'];

    // Buscar el usuario en la base de datos usando consulta preparada
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Verificar la contraseña
        $row = $result->fetch_assoc();
        if (password_verify($contraseña, $row['contraseña'])) {
            echo "Inicio de sesión exitoso. ¡Bienvenido " . $row['nombre'] . "!";
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "No se encontró una cuenta con ese correo.";
    }

    $stmt->close();
}
$conn->close();
?>
