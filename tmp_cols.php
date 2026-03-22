<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=mubs_super_admin','root','');
    $stmt = $pdo->query('SHOW COLUMNS FROM strategic_activities');
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
