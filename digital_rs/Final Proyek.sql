CREATE TABLE poli ( 
	id SERIAL PRIMARY KEY, 
	nama_poli VARCHAR(100) NOT NULL UNIQUE, 
	description TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE users ( 
	id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL UNIQUE, 
	password VARCHAR(255) NOT NULL,
	full_name VARCHAR(100),
	phone VARCHAR(20),      
	role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Dokter', 'Pasien')),
	poli_id INT REFERENCES poli(id) ON DELETE SET NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

CREATE TABLE jadwal ( 
	id SERIAL PRIMARY KEY,
	doctor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
	day_of_week VARCHAR(15) NOT NULL CHECK (day_of_week IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')), 
	start_time TIME NOT NULL, 
	duration_minutes INT NOT NULL DEFAULT 30, 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

CREATE TABLE obat ( 
	id SERIAL PRIMARY KEY, 
	nama_obat VARCHAR(150) NOT NULL,
	description TEXT, 
	jenis_obat VARCHAR(20) NOT NULL CHECK (jenis_obat IN ('keras', 'biasa')),
	stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
	expired_date DATE NOT NULL, 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

CREATE TABLE konsultasi ( 
	id SERIAL PRIMARY KEY,
	patient_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT, 
	doctor_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT, 
	schedule_id INT NOT NULL REFERENCES jadwal(id) ON DELETE RESTRICT, 
	booking_date DATE NOT NULL, 
	complaint TEXT NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Selesai', 'Cancelled')),
	rejection_reason TEXT, 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

-- Mencegah 2 pasien memesan slot dokter & tanggal yang sama (kecuali jika sudah Rejected/Cancelled)
CREATE UNIQUE INDEX unique_active_booking 
ON konsultasi (doctor_id, schedule_id, booking_date) 
WHERE status NOT IN ('Rejected', 'Cancelled');

CREATE TABLE rekam_medis (
	id SERIAL PRIMARY KEY, 
	id_konsultasi INT NOT NULL UNIQUE REFERENCES konsultasi(id) ON DELETE RESTRICT,
	patient_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
	doctor_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
	diagnosis TEXT NOT NULL, 
	medical_action TEXT NOT NULL,
	notes TEXT, 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE prescriptions (
	id SERIAL PRIMARY KEY,
	id_rekam_medis INT NOT NULL UNIQUE REFERENCES rekam_medis(id) ON DELETE RESTRICT,
	status VARCHAR(30) NOT NULL DEFAULT 'Menunggu Diproses' CHECK (status IN ('Menunggu Diproses', 'Siap Diambil', 'Sudah Diambil')), 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE prescription_items (
	id SERIAL PRIMARY KEY, 
	prescription_id INT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
	id_obat INT NOT NULL REFERENCES obat(id) ON DELETE RESTRICT,
	quantity INT NOT NULL CHECK (quantity > 0) 
);

INSERT INTO poli (nama_poli, description) VALUES
('Poli Umum', 'Layanan pemeriksaan kesehatan umum dan konsultasi medis dasar.'),
('Poli Gigi', 'Layanan perawatan, pembersihan, dan kesehatan gigi serta mulut.'),
('Poli Anak', 'Layanan kesehatan, tumbuh kembang, dan imunisasi khusus anak.'),
('Poli Penyakit Dalam', 'Layanan diagnosis dan penanganan penyakit organ dalam dewasa.');


INSERT INTO users (username, email, password, full_name, phone, role, poli_id) VALUES
-- 1. Akun Admin (poli_id wajib NULL)
('admin_rs', 'admin@digitalrs.com', 'admin123', 'Administrator Utama', '081234567890', 'Admin', NULL),
('admin_farmasi', 'farmasi@digitalrs.com', 'admin456', 'Rina Wijaya, S.Farm', '081234567891', 'Admin', NULL),

-- 2. Akun Dokter (poli_id merujuk ke id tabel poli di atas)
('dr_andi', 'andi.pratama@digitalrs.com', 'dokter431', 'dr. Andi Pratama', '081298765431', 'Dokter', 1),
('dr_siti', 'siti.rahma@digitalrs.com', 'dokter432', 'drg. Siti Rahmawati', '081298765432', 'Dokter', 2),
('dr_budi', 'budi.santoso@digitalrs.com', 'dokter433', 'dr. Budi Santoso, Sp.A', '081298765433', 'Dokter', 3),
('dr_maya', 'maya.kusuma@digitalrs.com', 'dokter434', 'dr. Maya Kusuma, Sp.PD', '081298765434', 'Dokter', 4),

-- 3. Akun Pasien (poli_id wajib NULL)
('ahmad_fauzi', 'ahmad.fauzi@gmail.com', 'pasien344', 'Ahmad Fauzi', '085711223344', 'Pasien', NULL),
('dewi_lestari', 'dewi.lestari@gmail.com', 'pasien345', 'Dewi Lestari', '085711223345', 'Pasien', NULL),
('rizky_hidayat', 'rizky.hidayat@gmail.com', 'pasien346', 'Rizky Hidayat', '085711223346', 'Pasien', NULL),
('nurul_aini', 'nurul.aini@gmail.com', 'pasien347', 'Nurul Aini', '085711223347', 'Pasien', NULL);

SELECT * FROM users;
