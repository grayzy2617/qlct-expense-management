-- ============================================
-- SQL MIGRATION SCRIPT FOR ROLE-BASED ACCESS CONTROL
-- Project: QLCT (Quản Lý Chi Tiêu)
-- Created: 2026-02-02
-- ============================================

-- Step 1: Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(255),
    INDEX idx_role_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 2: Create user_roles junction table (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    INDEX idx_user_roles_user_id (user_id),
    INDEX idx_user_roles_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 3: Insert default roles
INSERT INTO roles (name, description) VALUES 
    ('ROLE_USER', 'Người dùng thông thường'),
    ('ROLE_ADMIN', 'Quản trị viên hệ thống')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Step 4: Assign ROLE_USER to all existing users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE r.name = 'ROLE_USER'
AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

-- Step 5: Assign ROLE_ADMIN to admin user (if exists)
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

-- Step 6: Verify the migration
SELECT 
    u.username,
    GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ', ') AS roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.username
ORDER BY u.username;

-- ============================================
-- ROLLBACK SCRIPT (Use if needed to revert changes)
-- ============================================
-- DROP TABLE IF EXISTS user_roles;
-- DROP TABLE IF EXISTS roles;
-- ============================================
