-- Medical Fields
INSERT INTO medical_fields (id, name, description) VALUES
(1, 'Cardiology', 'Heart and cardiovascular system care'),
(2, 'Pediatrics', 'Medical care for infants, children, and adolescents'),
(3, 'Dermatology', 'Skin, hair, and nail conditions'),
(4, 'Orthopedics', 'Musculoskeletal system and joint care'),
(5, 'Neurology', 'Nervous system and brain disorders'),
(6, 'General Medicine', 'Primary care and general health services');

-- Doctors
INSERT INTO doctors (id, name, medical_field_id, experience_years) VALUES
(1, 'Dr. Sarah Johnson', 1, 10),
(2, 'Dr. Michael Chen', 1, 8),
(3, 'Dr. Emily Rodriguez', 2, 12),
(4, 'Dr. James Wilson', 2, 6),
(5, 'Dr. Lisa Anderson', 3, 9),
(6, 'Dr. Robert Brown', 4, 15),
(7, 'Dr. Maria Garcia', 5, 11),
(8, 'Dr. David Lee', 6, 7);

-- Time Slots for each doctor (9 AM to 5 PM, hourly slots)
INSERT INTO time_slots (id, doctor_id, start_time, end_time, is_available) VALUES
-- Dr. Sarah Johnson (Cardiology)
(1, 1, '09:00:00', '10:00:00', true),
(2, 1, '10:00:00', '11:00:00', true),
(3, 1, '11:00:00', '12:00:00', true),
(4, 1, '13:00:00', '14:00:00', true),
(5, 1, '14:00:00', '15:00:00', true),
(6, 1, '15:00:00', '16:00:00', true),
(7, 1, '16:00:00', '17:00:00', true),

-- Dr. Michael Chen (Cardiology)
(8, 2, '09:00:00', '10:00:00', true),
(9, 2, '10:00:00', '11:00:00', true),
(10, 2, '11:00:00', '12:00:00', true),
(11, 2, '13:00:00', '14:00:00', true),
(12, 2, '14:00:00', '15:00:00', true),
(13, 2, '15:00:00', '16:00:00', true),
(14, 2, '16:00:00', '17:00:00', true),

-- Dr. Emily Rodriguez (Pediatrics)
(15, 3, '09:00:00', '10:00:00', true),
(16, 3, '10:00:00', '11:00:00', true),
(17, 3, '11:00:00', '12:00:00', true),
(18, 3, '13:00:00', '14:00:00', true),
(19, 3, '14:00:00', '15:00:00', true),
(20, 3, '15:00:00', '16:00:00', true),
(21, 3, '16:00:00', '17:00:00', true),

-- Dr. James Wilson (Pediatrics)
(22, 4, '09:00:00', '10:00:00', true),
(23, 4, '10:00:00', '11:00:00', true),
(24, 4, '11:00:00', '12:00:00', true),
(25, 4, '13:00:00', '14:00:00', true),
(26, 4, '14:00:00', '15:00:00', true),
(27, 4, '15:00:00', '16:00:00', true),
(28, 4, '16:00:00', '17:00:00', true),

-- Dr. Lisa Anderson (Dermatology)
(29, 5, '09:00:00', '10:00:00', true),
(30, 5, '10:00:00', '11:00:00', true),
(31, 5, '11:00:00', '12:00:00', true),
(32, 5, '13:00:00', '14:00:00', true),
(33, 5, '14:00:00', '15:00:00', true),
(34, 5, '15:00:00', '16:00:00', true),
(35, 5, '16:00:00', '17:00:00', true),

-- Dr. Robert Brown (Orthopedics)
(36, 6, '09:00:00', '10:00:00', true),
(37, 6, '10:00:00', '11:00:00', true),
(38, 6, '11:00:00', '12:00:00', true),
(39, 6, '13:00:00', '14:00:00', true),
(40, 6, '14:00:00', '15:00:00', true),
(41, 6, '15:00:00', '16:00:00', true),
(42, 6, '16:00:00', '17:00:00', true),

-- Dr. Maria Garcia (Neurology)
(43, 7, '09:00:00', '10:00:00', true),
(44, 7, '10:00:00', '11:00:00', true),
(45, 7, '11:00:00', '12:00:00', true),
(46, 7, '13:00:00', '14:00:00', true),
(47, 7, '14:00:00', '15:00:00', true),
(48, 7, '15:00:00', '16:00:00', true),
(49, 7, '16:00:00', '17:00:00', true),

-- Dr. David Lee (General Medicine)
(50, 8, '09:00:00', '10:00:00', true),
(51, 8, '10:00:00', '11:00:00', true),
(52, 8, '11:00:00', '12:00:00', true),
(53, 8, '13:00:00', '14:00:00', true),
(54, 8, '14:00:00', '15:00:00', true),
(55, 8, '15:00:00', '16:00:00', true),
(56, 8, '16:00:00', '17:00:00', true);

