<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "reservas_futbol";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$fecha = $_POST['fecha'];
$hora = $_POST['hora'];
$cancha = $_POST['cancha'];

$sql = "SELECT * FROM reservas WHERE fecha = '$fecha' AND hora = '$hora' AND cancha = '$cancha'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'La cancha no está disponible en ese horario.']);
} else {
    $sql = "INSERT INTO reservas (fecha, hora, cancha) VALUES ('$fecha', '$hora', '$cancha')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al realizar la reserva.']);
    }
}


$conn->close();
?>