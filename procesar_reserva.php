<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "reservas_futbol";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Obtener datos del formulario
$fecha = $_POST['fecha'];
$hora = $_POST['hora'];
$cancha = $_POST['cancha'];

// Consulta preparada para evitar inyección SQL
$stmt = $conn->prepare("SELECT * FROM reservas WHERE fecha = ? AND hora = ? AND cancha = ?");
$stmt->bind_param("sss", $fecha, $hora, $cancha);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si la cancha ya está reservada
if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'La cancha no está disponible en ese horario.']);
} else {
    // Insertar nueva reserva
    $stmt = $conn->prepare("INSERT INTO reservas (fecha, hora, cancha) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $fecha, $hora, $cancha);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al realizar la reserva.']);
    }
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
