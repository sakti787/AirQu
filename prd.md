Product Requirements Document: Dasbor AirQu
Versi: 1.0

Tanggal: 20 September 2025

Status: Draf

Penulis: (Namamu)

1. Latar Belakang & Visi Produk 🔭
Latar Belakang: Polusi udara adalah masalah lingkungan dan kesehatan yang signifikan di banyak kota di Indonesia dan dunia. Namun, informasi mengenai kualitas udara seringkali tersebar, sulit diakses, atau disajikan dalam format teknis yang tidak mudah dipahami oleh masyarakat umum.

Visi Produk: Menjadi sumber informasi kualitas udara yang paling mudah diakses, akurat, dan dapat dipahami bagi masyarakat Indonesia, memberdayakan mereka untuk membuat keputusan yang lebih baik terkait kesehatan dan aktivitas sehari-hari.

2. Masalah yang Diselesaikan (Problem Statement) 🎯
Warga perkotaan tidak memiliki cara yang cepat dan mudah untuk mengetahui tingkat kualitas udara di sekitar mereka secara real-time. Akibatnya, mereka tidak dapat mengambil tindakan pencegahan yang diperlukan, seperti menghindari olahraga di luar ruangan saat polusi sedang tinggi atau menggunakan pembersih udara di dalam rumah.

3. Target Pengguna (User Persona) 👥
Nama: Budi Santoso

Usia: 35 tahun

Pekerjaan: Pekerja kantor di Surakarta

Kebutuhan & Tujuan: Budi adalah seorang ayah yang peduli dengan kesehatan keluarganya. Dia suka bersepeda di pagi hari tetapi khawatir tentang dampak polusi. Dia butuh cara cepat untuk memeriksa kualitas udara sebelum memutuskan apakah aman bagi dia dan anaknya untuk beraktivitas di luar.

Frustrasi: Informasi dari berita seringkali bersifat umum dan tidak spesifik untuk wilayahnya. Aplikasi cuaca yang ada hanya memberikan informasi AQI sebagai angka kecil tanpa konteks.

4. Tujuan & Sasaran (Goals & Objectives) 📈
Tujuan Bisnis/Proyek: Membuat sebuah proyek portofolio full-stack yang menunjukkan keahlian dalam integrasi API, visualisasi data, dan pengembangan aplikasi web yang responsif dan berpusat pada pengguna.

Tujuan Pengguna: Mendapatkan informasi kualitas udara yang akurat dan relevan dengan lokasi mereka secara instan.

Sasaran (Metrics):

Akurasi Data: 99% data yang ditampilkan sesuai dengan data dari sumber API.

Waktu Muat Halaman (Load Time): Halaman utama dimuat sepenuhnya dalam waktu kurang dari 2 detik.

Keterlibatan Pengguna: Pengguna menghabiskan rata-rata 90 detik per sesi, menandakan mereka mengeksplorasi data.

5. Fitur & Fungsionalitas (Features & Requirements) 🛠️
Versi 1.0 (MVP - Minimum Viable Product)
Prioritas	Fitur	Deskripsi Fungsional	Keterangan Teknis
P1	Peta Kualitas Udara Interaktif	Pengguna melihat peta Indonesia (terpusat di lokasi mereka) dengan titik-titik berkode warna yang mewakili tingkat AQI di berbagai stasiun pemantauan.	Gunakan Mapbox/Leaflet. Ambil data lokasi stasiun dari API OpenAQ/IQAir.
P1	Detail Lokasi Spesifik	Saat mengklik sebuah titik di peta atau mencari lokasi, sebuah panel akan muncul menampilkan: Indeks AQI (angka & kategori), polutan utama (PM2.5, O3), saran kesehatan, dan waktu data terakhir diperbarui.	Tampilkan data dari endpoint API yang spesifik untuk stasiun/lokasi tersebut.
P1	Pencarian Lokasi	Pengguna dapat mengetik nama kota atau wilayah di bilah pencarian untuk langsung melompat ke lokasi tersebut di peta.	Implementasikan pencarian dengan geocoding (bisa dari Mapbox atau API lain).
P2	Deteksi Lokasi Otomatis	Aplikasi akan meminta izin untuk mengakses lokasi pengguna dan secara otomatis menampilkan data untuk area terdekat saat pertama kali dibuka.	Gunakan Geolocation API browser.
P2	Grafik Tren Historis (24 Jam)	Di panel detail lokasi, pengguna dapat melihat grafik sederhana yang menunjukkan fluktuasi AQI selama 24 jam terakhir.	Ambil data historis dari API. Gunakan library chart seperti Recharts/Chart.js.

Ekspor ke Spreadsheet
Lingkup Proyek (Scope)
Termasuk dalam V1.0 (In-Scope):

Visualisasi data AQI dan polutan utama.

Fokus pada data dari stasiun pemantauan resmi yang disediakan oleh API.

Aplikasi web yang responsif (Mobile-first).

Tidak Termasuk dalam V1.0 (Out-of-Scope):

Sistem akun pengguna dan login.

Notifikasi push.

Prediksi kualitas udara (ramalan cuaca).

Data dari sumber selain API yang telah ditentukan.

6. Desain & Pengalaman Pengguna (Design & UX) 🎨
Prinsip Desain:

Clarity over Clutter: Prioritaskan informasi yang paling penting (angka AQI dan warna). Hindari antarmuka yang ramai.

Mobile-First: Desain dioptimalkan untuk pengalaman terbaik di perangkat seluler.

Aksesibilitas: Pastikan kontras warna cukup tinggi dan teks mudah dibaca.

Alur Pengguna (User Flow):

Pengguna membuka web.

Aplikasi meminta akses lokasi -> Pengguna menyetujui.

Peta langsung menampilkan data di sekitar pengguna.

Pengguna mengetuk titik terdekat -> Panel detail muncul.

Pengguna melihat grafik tren 24 jam.

Pengguna menggunakan bilah pencarian untuk memeriksa lokasi lain (misal: rumah orang tua).

7. Metrik Keberhasilan (Success Metrics) 🏆
Proyek ini dianggap berhasil jika:

Fungsionalitas Inti Bekerja: Semua fitur P1 berfungsi tanpa bug mayor pada perangkat desktop dan mobile (Chrome, Safari).

Performa Optimal: Skor Lighthouse untuk Performance, Accessibility, dan SEO di atas 90.

Umpan Balik Positif: Saat didemokan (misalnya saat wawancara), pengguna dapat memahami dan menggunakan aplikasi dengan mudah tanpa panduan.