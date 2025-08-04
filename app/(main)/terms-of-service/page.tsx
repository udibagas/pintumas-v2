import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Beranda
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Syarat dan Ketentuan</h1>
        <p className="text-gray-600">Terakhir diperbarui: 29 Juni 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
          <p className="text-yellow-800">
            <strong>Ringkasan:</strong> Dengan menggunakan platform berita kami, Anda setuju untuk mematuhi syarat dan ketentuan yang tercantum di bawah ini.
            Harap baca dengan seksama sebelum menggunakan layanan kami.
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Penerimaan Syarat</h2>
        <p className="mb-4">
          Dengan mengakses dan menggunakan situs web ini (&quot;Layanan&quot;), Anda menyetujui untuk terikat oleh syarat dan ketentuan ini (&quot;Syarat&quot;).
          Jika Anda tidak setuju dengan syarat ini, Anda tidak boleh menggunakan Layanan kami.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Deskripsi Layanan</h2>
        <p className="mb-4">
          Platform kami menyediakan layanan berita dan informasi yang mencakup:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Akses ke informasi berita dan konten editorial</li>
          <li>Fitur pencarian dan kategorisasi konten</li>
          <li>Kemampuan untuk membuat akun pengguna</li>
          <li>Fitur berbagi dan interaksi sosial</li>
          <li>Newsletter dan notifikasi berita</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Akun Pengguna</h2>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Pendaftaran Akun</h3>
        <p className="mb-4">
          Untuk mengakses fitur tertentu, Anda mungkin perlu membuat akun. Anda bertanggung jawab untuk:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Memberikan informasi yang akurat dan terkini</li>
          <li>Menjaga keamanan kata sandi Anda</li>
          <li>Memberi tahu kami tentang penggunaan akun yang tidak sah</li>
          <li>Bertanggung jawab atas semua aktivitas yang terjadi di akun Anda</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Persyaratan Usia</h3>
        <p className="mb-6">
          Anda harus berusia minimal 13 tahun untuk menggunakan Layanan ini. Jika Anda berusia di bawah 18 tahun,
          Anda harus mendapat persetujuan dari orang tua atau wali.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Penggunaan yang Dilarang</h2>
        <p className="mb-4">
          Anda setuju untuk tidak menggunakan Layanan untuk:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Melanggar hukum atau peraturan yang berlaku</li>
          <li>Mengirim konten yang menyinggung, kasar, atau tidak pantas</li>
          <li>Menyebarkan informasi palsu atau menyesatkan</li>
          <li>Melecehkan, mengancam, atau mengganggu pengguna lain</li>
          <li>Melanggar hak kekayaan intelektual orang lain</li>
          <li>Mencoba mengakses sistem secara tidak sah</li>
          <li>Menggunakan bot atau otomatisasi tanpa izin</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Konten dan Hak Kekayaan Intelektual</h2>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Konten Kami</h3>
        <p className="mb-4">
          Semua konten yang tersedia di platform ini, termasuk teks, gambar, video, dan desain,
          dilindungi oleh hak cipta dan hak kekayaan intelektual lainnya. Anda tidak boleh:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Menyalin atau mendistribusikan konten tanpa izin</li>
          <li>Menggunakan konten untuk tujuan komersial tanpa lisensi</li>
          <li>Memodifikasi atau membuat karya turunan</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Konten Pengguna</h3>
        <p className="mb-6">
          Dengan mengirim konten ke platform kami, Anda memberikan kami lisensi non-eksklusif untuk menggunakan,
          menampilkan, dan mendistribusikan konten tersebut dalam konteks Layanan kami.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Privasi dan Data</h2>
        <p className="mb-6">
          Penggunaan informasi pribadi Anda diatur oleh Kebijakan Privasi kami.
          Dengan menggunakan Layanan, Anda setuju dengan praktik yang dijelaskan dalam kebijakan tersebut.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Penghentian Layanan</h2>
        <p className="mb-4">
          Kami berhak untuk menghentikan atau menangguhkan akses Anda ke Layanan kapan saja, dengan atau tanpa pemberitahuan, jika:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Anda melanggar syarat dan ketentuan ini</li>
          <li>Kami mencurigai aktivitas yang mencurigakan atau ilegal</li>
          <li>Atas permintaan otoritas hukum</li>
          <li>Untuk melindungi keamanan platform dan pengguna lain</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Pembatasan Tanggung Jawab</h2>
        <p className="mb-4">
          Layanan disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apa pun. Kami tidak bertanggung jawab atas:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Kerugian langsung, tidak langsung, atau konsekuensial</li>
          <li>Kehilangan data atau gangguan bisnis</li>
          <li>Konten atau tindakan pengguna lain</li>
          <li>Gangguan teknis atau downtime</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Ganti Rugi</h2>
        <p className="mb-6">
          Anda setuju untuk mengganti rugi dan membebaskan kami dari semua klaim, kerugian, dan biaya
          yang timbul dari penggunaan Layanan oleh Anda atau pelanggaran syarat ini.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Hukum yang Berlaku</h2>
        <p className="mb-6">
          Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.
          Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Jakarta.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Perubahan Syarat</h2>
        <p className="mb-6">
          Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku efektif
          setelah diposting di situs web. Penggunaan berkelanjutan dari Layanan merupakan persetujuan
          Anda terhadap syarat yang diperbarui.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Kontak</h2>
        <p className="mb-4">
          Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Email:</strong> legal@newssite.com</p>
          <p><strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta 10110, Indonesia</p>
          <p><strong>Telepon:</strong> +62 21 1234 5678</p>
        </div>
      </div>
    </div>
  );
}
