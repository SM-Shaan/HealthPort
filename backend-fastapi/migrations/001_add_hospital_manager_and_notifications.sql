-- Migration: Add Hospital Manager and Notification tables
-- Date: 2025-11-07
-- Description: Adds hospital_manager and notification tables to support hospital manager role and email notifications

-- Create hospital_manager table
CREATE TABLE IF NOT EXISTS hospital_manager (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    hospital_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id) ON DELETE CASCADE,
    INDEX idx_hospital_manager_email (email),
    INDEX idx_hospital_manager_hospital (hospital_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notification table
CREATE TABLE IF NOT EXISTS notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(20) NOT NULL COMMENT 'patient, doctor, manager',
    notification_type VARCHAR(50) NOT NULL COMMENT 'appointment_booked, appointment_cancelled, etc.',
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL COMMENT 'sent, failed, pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notification_recipient (recipient_email),
    INDEX idx_notification_type (notification_type),
    INDEX idx_notification_status (status),
    INDEX idx_notification_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample hospital manager (optional - for testing)
-- Password: manager123
-- You can create a hospital manager using the API endpoint /api/auth/register-manager

-- Example: Insert a test hospital manager for hospital_id = 1
-- INSERT INTO hospital_manager (email, name, password, phone, hospital_id)
-- VALUES ('manager@hospital.com', 'John Manager', 'manager123', '555-0100', 1);

-- Insert into webuser table for the hospital manager
-- INSERT INTO webuser (email, usertype)
-- VALUES ('manager@hospital.com', 'h');

-- Verify tables were created
SELECT 'hospital_manager table created' as status, COUNT(*) as row_count FROM hospital_manager
UNION ALL
SELECT 'notification table created' as status, COUNT(*) as row_count FROM notification;
