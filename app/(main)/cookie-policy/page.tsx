import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Beranda
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Kebijakan Cookie</h1>
        <p className="text-gray-600">Terakhir diperbarui: 29 Juni 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
          <p className="text-yellow-800">
            <strong>Ringkasan:</strong> Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman Anda di situs web kami.
            Kebijakan ini menjelaskan jenis cookie yang kami gunakan dan bagaimana Anda dapat mengelolanya.
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Apa itu Cookie?</h2>
        <p className="mb-4">
          Cookie adalah file teks kecil yang ditempatkan di perangkat Anda (komputer, smartphone, atau tablet)
          ketika Anda mengunjungi situs web. Cookie membantu situs web mengingat informasi tentang kunjungan Anda,
          yang dapat membuat kunjungan berikutnya lebih mudah dan situs lebih berguna bagi Anda.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Jenis Cookie yang Kami Gunakan</h2>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie yang Diperlukan</h3>
        <p className="mb-4">
          Cookie ini sangat penting untuk pengoperasian situs web kami dan tidak dapat dinonaktifkan.
          Biasanya cookie ini hanya diatur sebagai respons terhadap tindakan yang Anda lakukan seperti:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Masuk ke akun Anda</li>
          <li>Mengatur preferensi privasi</li>
          <li>Mengisi formulir</li>
          <li>Menjaga keamanan situs</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Fungsional</h3>
        <p className="mb-4">
          Cookie ini memungkinkan situs web untuk menyediakan fungsionalitas dan personalisasi yang ditingkatkan:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Mengingat pilihan bahasa Anda</li>
          <li>Menyimpan preferensi tampilan</li>
          <li>Mengingat artikel yang disimpan</li>
          <li>Personalisasi konten berdasarkan minat</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Analitik</h3>
        <p className="mb-4">
          Cookie ini membantu kami memahami bagaimana pengunjung berinteraksi dengan situs web kami:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Halaman yang paling sering dikunjungi</li>
          <li>Waktu yang dihabiskan di situs</li>
          <li>Jalur navigasi pengguna</li>
          <li>Sumber lalu lintas situs web</li>
          <li>Informasi perangkat dan browser</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Media Sosial</h3>
        <p className="mb-6">
          Cookie ini diatur oleh berbagai layanan media sosial yang telah kami tambahkan ke situs
          untuk memungkinkan Anda berbagi konten kami dengan teman dan jaringan Anda.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Cookie Pihak Ketiga</h2>
        <p className="mb-4">
          Kami juga menggunakan layanan pihak ketiga yang dapat menempatkan cookie di perangkat Anda:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Layanan</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Tujuan</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Durasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                <td className="border border-gray-300 px-4 py-2">Analisis lalu lintas dan perilaku pengguna</td>
                <td className="border border-gray-300 px-4 py-2">2 tahun</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">Facebook Pixel</td>
                <td className="border border-gray-300 px-4 py-2">Tracking konversi dan iklan</td>
                <td className="border border-gray-300 px-4 py-2">3 bulan</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">YouTube</td>
                <td className="border border-gray-300 px-4 py-2">Menyematkan video dan melacak tayangan</td>
                <td className="border border-gray-300 px-4 py-2">Sesi</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Mengelola Cookie</h2>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Pengaturan Browser</h3>
        <p className="mb-4">
          Sebagian besar browser web memungkinkan Anda untuk mengontrol cookie melalui pengaturan browser:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
          <li><strong>Mozilla Firefox:</strong> Preferences &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
          <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Pengaturan Situs Web</h3>
        <p className="mb-4">
          Kami menyediakan kontrol cookie yang dapat Anda akses melalui:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Banner persetujuan cookie yang muncul saat kunjungan pertama</li>
          <li>Pengaturan akun Anda (jika Anda terdaftar)</li>
          <li>Link &quot;Kelola Cookie&quot; di footer situs web</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Dampak Menonaktifkan Cookie</h2>
        <p className="mb-4">
          Menonaktifkan cookie dapat mempengaruhi fungsionalitas situs web:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Anda mungkin perlu masuk ulang setiap kali mengunjungi situs</li>
          <li>Preferensi Anda tidak akan disimpan</li>
          <li>Beberapa fitur mungkin tidak berfungsi dengan baik</li>
          <li>Konten yang dipersonalisasi mungkin tidak tersedia</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookie untuk Anak-anak</h2>
        <p className="mb-6">
          Kami tidak secara sadar mengumpulkan informasi pribadi dari anak-anak di bawah usia 13 tahun
          melalui cookie atau teknologi pelacakan lainnya. Jika Anda yakin kami telah mengumpulkan
          informasi seperti itu, silakan hubungi kami.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Perubahan Kebijakan Cookie</h2>
        <p className="mb-6">
          Kami dapat memperbarui Kebijakan Cookie ini dari waktu ke waktu untuk mencerminkan perubahan
          dalam praktik kami atau untuk alasan operasional, hukum, atau peraturan lainnya.
          Kami akan memberi tahu Anda tentang perubahan material dengan memposting kebijakan yang diperbarui di situs web kami.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Informasi Lebih Lanjut</h2>
        <p className="mb-4">
          Untuk informasi lebih lanjut tentang cookie dan cara mengelolanya, Anda dapat mengunjungi:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><a href="https://www.allaboutcookies.org" className="text-yellow-600 hover:text-yellow-700">AllAboutCookies.org</a></li>
          <li><a href="https://www.youronlinechoices.com" className="text-yellow-600 hover:text-yellow-700">YourOnlineChoices.com</a></li>
          <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-yellow-600 hover:text-yellow-700">Google Analytics Opt-out</a></li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Kontak</h2>
        <p className="mb-4">
          Jika Anda memiliki pertanyaan tentang Kebijakan Cookie ini atau penggunaan cookie di situs web kami,
          silakan hubungi kami:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Email:</strong> privacy@newssite.com</p>
          <p><strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta 10110, Indonesia</p>
          <p><strong>Telepon:</strong> +62 21 1234 5678</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
          <p className="text-blue-800">
            <strong>Catatan:</strong> Dengan melanjutkan menggunakan situs web kami, Anda menyetujui penggunaan cookie
            sesuai dengan kebijakan ini. Anda dapat mengubah pengaturan cookie Anda kapan saja melalui browser Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
