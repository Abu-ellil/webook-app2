-- Seed data for Event Booking Database

-- Insert admin user
INSERT INTO admins (id, username, password) VALUES 
('admin-001', 'admin', 'admin123');

-- Insert sample event
INSERT INTO events (id, title, description, date, venue) VALUES 
('event-001', 
 'ليلة عودة المسافرين - راشد الماجد وفضل شاكر',
 'استمتع بأمسية موسيقية رائعة مع نجوم الطرب العربي راشد الماجد وفضل شاكر في ليلة لا تُنسى من الموسيقى والطرب الأصيل.',
 '2025-07-24 21:00:00',
 'معرض الظهران إكسبو');

-- Insert seats for the event
-- VVIP Section (20 seats)
INSERT INTO seats (id, event_id, row_letter, seat_number, section, price, category, is_booked) VALUES
('seat-vvip-001', 'event-001', 'A', 1, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-002', 'event-001', 'A', 2, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-003', 'event-001', 'A', 3, 'VVIP', 2500.00, 'VVIP', TRUE),
('seat-vvip-004', 'event-001', 'A', 4, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-005', 'event-001', 'A', 5, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-006', 'event-001', 'A', 6, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-007', 'event-001', 'A', 7, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-008', 'event-001', 'A', 8, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-009', 'event-001', 'A', 9, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-010', 'event-001', 'A', 10, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-011', 'event-001', 'B', 1, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-012', 'event-001', 'B', 2, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-013', 'event-001', 'B', 3, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-014', 'event-001', 'B', 4, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-015', 'event-001', 'B', 5, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-016', 'event-001', 'B', 6, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-017', 'event-001', 'B', 7, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-018', 'event-001', 'B', 8, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-019', 'event-001', 'B', 9, 'VVIP', 2500.00, 'VVIP', FALSE),
('seat-vvip-020', 'event-001', 'B', 10, 'VVIP', 2500.00, 'VVIP', FALSE);

-- VIP Section (40 seats)
INSERT INTO seats (id, event_id, row_letter, seat_number, section, price, category, is_booked) 
SELECT 
    CONCAT('seat-vip-', LPAD(ROW_NUMBER() OVER(), 3, '0')),
    'event-001',
    CHAR(67 + FLOOR((ROW_NUMBER() OVER() - 1) / 12)), -- C, D, E, F
    ((ROW_NUMBER() OVER() - 1) % 12) + 1,
    'VIP',
    1250.00,
    'VIP',
    CASE WHEN RAND() < 0.1 THEN TRUE ELSE FALSE END
FROM (
    SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
    UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
    UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25
    UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
    UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35
    UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
) numbers;

-- Royal Section (60 seats)
INSERT INTO seats (id, event_id, row_letter, seat_number, section, price, category, is_booked) 
SELECT 
    CONCAT('seat-royal-', LPAD(ROW_NUMBER() OVER(), 3, '0')),
    'event-001',
    CHAR(71 + FLOOR((ROW_NUMBER() OVER() - 1) / 15)), -- G, H, I, J
    ((ROW_NUMBER() OVER() - 1) % 15) + 1,
    'Royal',
    950.00,
    'Royal',
    CASE WHEN RAND() < 0.15 THEN TRUE ELSE FALSE END
FROM (
    SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
    UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
    UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25
    UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
    UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35
    UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
    UNION SELECT 41 UNION SELECT 42 UNION SELECT 43 UNION SELECT 44 UNION SELECT 45
    UNION SELECT 46 UNION SELECT 47 UNION SELECT 48 UNION SELECT 49 UNION SELECT 50
    UNION SELECT 51 UNION SELECT 52 UNION SELECT 53 UNION SELECT 54 UNION SELECT 55
    UNION SELECT 56 UNION SELECT 57 UNION SELECT 58 UNION SELECT 59 UNION SELECT 60
) numbers;

-- Add more seat categories (Diamond, Platinum, Gold, Silver, Bronze)
-- This is a simplified version - you can expand this pattern for all categories