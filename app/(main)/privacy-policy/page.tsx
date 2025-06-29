import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Beranda
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Kebijakan Privasi</h1>
        <p className="text-gray-600">Terakhir diperbarui: 29 Juni 2025</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
          <p className="text-yellow-800">
            <strong>Ringkasan:</strong> Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.
            Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
        <p className="mb-4">
          Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Informasi akun (nama, alamat email, kata sandi)</li>
          <li>Informasi profil (bio, foto profil)</li>
          <li>Konten yang Anda buat atau bagikan</li>
          <li>Komunikasi dengan kami</li>
          <li>Preferensi dan pengaturan akun</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Informasi yang Dikumpulkan Secara Otomatis</h3>
        <p className="mb-4">
          Ketika Anda menggunakan layanan kami, kami secara otomatis mengumpulkan:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Informasi perangkat (jenis perangkat, sistem operasi)</li>
          <li>Data penggunaan (halaman yang dikunjungi, waktu yang dihabiskan)</li>
          <li>Alamat IP dan informasi lokasi umum</li>
          <li>Cookie dan teknologi pelacakan serupa</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
        <p className="mb-4">
          Kami menggunakan informasi yang dikumpulkan untuk:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Menyediakan dan memelihara layanan kami</li>
          <li>Memproses transaksi dan mengelola akun Anda</li>
          <li>Mengirimkan pemberitahuan dan komunikasi penting</li>
          <li>Mempersonalisasi pengalaman pengguna</li>
          <li>Menganalisis dan meningkatkan layanan kami</li>
          <li>Mencegah penipuan dan memastikan keamanan</li>
          <li>Mematuhi kewajiban hukum</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Berbagi Informasi</h2>
        <p className="mb-4">
          Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Kami dapat membagikan informasi dalam situasi berikut:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Penyedia Layanan:</strong> Dengan pihak ketiga yang membantu mengoperasikan layanan kami</li>
          <li><strong>Kewajiban Hukum:</strong> Ketika diwajibkan oleh hukum atau proses hukum</li>
          <li><strong>Keamanan:</strong> Untuk melindungi hak, properti, atau keselamatan kami dan pengguna</li>
          <li><strong>Persetujuan:</strong> Dengan persetujuan eksplisit Anda</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Keamanan Data</h2>
        <p className="mb-6">
          Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi
          informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Ini termasuk:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Enkripsi data saat transit dan saat disimpan</li>
          <li>Kontrol akses yang ketat</li>
          <li>Pemantauan keamanan reguler</li>
          <li>Pelatihan keamanan untuk karyawan</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Hak Anda</h2>
        <p className="mb-4">
          Anda memiliki hak-hak berikut terkait informasi pribadi Anda:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Akses:</strong> Meminta salinan data pribadi yang kami miliki tentang Anda</li>
          <li><strong>Koreksi:</strong> Meminta koreksi data yang tidak akurat atau tidak lengkap</li>
          <li><strong>Penghapusan:</strong> Meminta penghapusan data pribadi Anda</li>
          <li><strong>Pembatasan:</strong> Meminta pembatasan pemrosesan data Anda</li>
          <li><strong>Portabilitas:</strong> Meminta transfer data Anda ke penyedia layanan lain</li>
          <li><strong>Keberatan:</strong> Menolak pemrosesan data untuk tujuan tertentu</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookie dan Teknologi Pelacakan</h2>
        <p className="mb-4">
          Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna.
          Anda dapat mengelola preferensi cookie melalui pengaturan browser Anda.
        </p>
        <p className="mb-6">
          Untuk informasi lebih detail, silakan baca <Link href="/cookie-policy" className="text-yellow-600 hover:text-yellow-700">Kebijakan Cookie</Link> kami.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Retensi Data</h2>
        <p className="mb-6">
          Kami menyimpan informasi pribadi Anda selama diperlukan untuk tujuan yang dijelaskan dalam
          kebijakan ini, atau sesuai dengan kewajiban hukum. Setelah periode retensi berakhir,
          kami akan menghapus atau menganonimkan data Anda secara aman.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Transfer Internasional</h2>
        <p className="mb-6">
          Data Anda mungkin diproses di negara selain Indonesia. Kami memastikan bahwa transfer
          tersebut dilakukan sesuai dengan standar perlindungan data yang berlaku dan dengan
          jaminan keamanan yang memadai.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Perubahan Kebijakan</h2>
        <p className="mb-6">
          Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan material
          akan diberitahukan melalui email atau pemberitahuan di situs web kami. Penggunaan
          berkelanjutan atas layanan kami setelah perubahan menunjukkan penerimaan Anda terhadap
          kebijakan yang diperbarui.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Hubungi Kami</h2>
        <p className="mb-4">
          Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan
          hak-hak Anda, silakan hubungi kami:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Email:</strong> privacy@newshub.com</p>
          <p><strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta 10110, Indonesia</p>
          <p><strong>Telepon:</strong> +62 21 1234 5678</p>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Komitmen Kami</h3>
          <p className="text-blue-800">
            Kami berkomitmen untuk melindungi privasi dan keamanan data Anda. Tim kami secara
            berkelanjutan meninjau dan memperbarui praktik keamanan kami untuk memastikan
            perlindungan terbaik bagi informasi pribadi Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
