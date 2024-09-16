<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "usuarios";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];
    $contraseña = $_POST['contraseña'];

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($contraseña, $user['contraseña'])) {
            echo json_encode(['success' => true, 'nombre' => $user['nombre']]);
        } else {
            echo json_encode(['success' => false, 'message' => "Contraseña incorrecta."]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => "El correo no está registrado."]);
    }

    $stmt->close();
}

$conn->close();
?>


