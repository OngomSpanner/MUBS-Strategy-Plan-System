<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=mubs_super_admin','root','');
    
    // Check if column already exists
    $stmt = $pdo->query("SHOW COLUMNS FROM strategic_activities LIKE 'frequency_interval'");
    if (!$stmt->fetch()) {
        echo "Adding frequency_interval column...\n";
        $pdo->exec("ALTER TABLE strategic_activities ADD COLUMN frequency_interval INT DEFAULT 1 AFTER frequency");
        echo "Column added successfully!\n";
    } else {
        echo "Column frequency_interval already exists.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
