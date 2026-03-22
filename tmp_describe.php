<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=mubs_super_admin','root','');
    $stmt = $pdo->query('DESCRIBE strategic_activities');
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo $e->getMessage();
}
