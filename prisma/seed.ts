import { Media } from "./../node_modules/.prisma/client/index.d";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@pintumas.id" },
    update: {},
    create: {
      email: "admin@pintumas.id",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      bio: "System administrator for PINTUMAS",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create moderator user
  const modPassword = await hashPassword("mod123");
  const moderator = await prisma.user.upsert({
    where: { email: "moderator@pintumas.id" },
    update: {},
    create: {
      email: "moderator@pintumas.id",
      name: "Moderator User",
      password: modPassword,
      role: "MODERATOR",
      bio: "Content moderator for PINTUMAS",
    },
  });

  console.log("Created moderator user:", moderator.email);

  // Create regular test user
  const testPassword = await hashPassword("test123");
  const testUser = await prisma.user.upsert({
    where: { email: "test@pintumas.id" },
    update: {},
    create: {
      email: "test@pintumas.id",
      name: "Test User",
      password: testPassword,
      role: "USER",
      bio: "Regular test user for PINTUMAS",
    },
  });

  console.log("Created test user:", testUser.email);

  // Create departments
  const departments = [
    {
      name: "IT & Digital Innovation",
      slug: "it-digital-innovation",
    },
    {
      name: "Operations & Logistics",
      slug: "operations-logistics",
    },
    {
      name: "Finance & Administration",
      slug: "finance-administration",
    },
    {
      name: "Customer Service",
      slug: "customer-service",
    },
    {
      name: "Human Resources",
      slug: "human-resources",
    },
  ];

  const createdDepartments = [];
  for (const deptData of departments) {
    const department = await prisma.department.upsert({
      where: { slug: deptData.slug },
      update: {},
      create: deptData,
    });
    createdDepartments.push(department);
    console.log("Created department:", department.name);
  }

  // Assign users to departments
  await prisma.user.update({
    where: { id: admin.id },
    data: { departmentId: createdDepartments[0].id }, // IT & Digital Innovation
  });

  await prisma.user.update({
    where: { id: moderator.id },
    data: { departmentId: createdDepartments[3].id }, // Customer Service
  });

  await prisma.user.update({
    where: { id: testUser.id },
    data: { departmentId: createdDepartments[1].id }, // Operations & Logistics
  });

  console.log("Assigned users to departments");

  // Create tags
  const tags = [
    { name: "Breaking News", slug: "breaking-news" },
    { name: "Analysis", slug: "analysis" },
    { name: "Opinion", slug: "opinion" },
    { name: "Interview", slug: "interview" },
    { name: "Research", slug: "research" },
    { name: "Innovation", slug: "innovation" },
    { name: "Trending", slug: "trending" },
  ];

  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData,
    });
    console.log("Created tag:", tag.name);
  }

  // Create sample posts
  const samplePosts = [
    {
      title: "The Future of Artificial Intelligence in Indonesia",
      slug: "future-ai-indonesia",
      summary:
        "Exploring how AI technologies are transforming various industries across Indonesia.",
      content:
        "Artificial Intelligence (AI) is rapidly becoming a cornerstone of technological advancement in Indonesia. From healthcare to finance, AI is revolutionizing how businesses operate and serve their customers. This comprehensive analysis explores the current state of AI adoption in Indonesia, the challenges faced by organizations, and the promising opportunities that lie ahead. As the government continues to invest in digital infrastructure and education, Indonesia is positioning itself as a leader in AI innovation within Southeast Asia.",
      imageUrl:
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600",
      status: "PUBLISHED" as const,
      featured: true,
      allowComment: true,
      readTime: "5 min read",
      publishedAt: new Date(),
      authorId: admin.id,
      departmentId: createdDepartments[0].id, // IT & Digital Innovation
    },
    {
      title: "Indonesian Startups Securing Record Funding in 2024",
      slug: "indonesian-startups-record-funding-2024",
      summary:
        "Local startups are attracting unprecedented investment from both domestic and international investors.",
      content:
        "The Indonesian startup ecosystem is experiencing remarkable growth, with record-breaking funding rounds throughout 2024. This surge in investment confidence reflects the maturity of the local tech scene and the growing recognition of Indonesia's market potential. Key sectors driving this growth include fintech, e-commerce, healthcare technology, and sustainable solutions. Investors are particularly interested in startups that address local challenges while having the potential to scale regionally.",
      imageUrl:
        "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
      status: "PUBLISHED" as const,
      featured: false,
      allowComment: true,
      readTime: "4 min read",
      publishedAt: new Date(),
      authorId: moderator.id,
      departmentId: createdDepartments[0].id, // IT & Digital Innovation
    },
    {
      title: "Digital Banking Revolution in Southeast Asia",
      slug: "digital-banking-revolution-southeast-asia",
      summary:
        "How digital-first banks are reshaping the financial landscape across the region.",
      content:
        "Digital banking is transforming the financial services landscape across Southeast Asia, with Indonesia leading many innovative initiatives. Traditional banks are rapidly digitizing their services while new digital-native banks are capturing market share with user-friendly interfaces and innovative financial products. This transformation is particularly significant in Indonesia, where a large portion of the population remains underbanked, creating enormous opportunities for financial inclusion through digital channels.",
      imageUrl:
        "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=600",
      status: "DRAFT" as const,
      featured: false,
      allowComment: false, // Comments disabled for draft posts
      readTime: "6 min read",
      authorId: admin.id,
      departmentId: createdDepartments[2].id, // Finance & Administration
    },
  ];

  for (const postData of samplePosts) {
    const media = await prisma.media.create({
      data: {
        url:
          "https://picsum.photos/600/400?random=" +
          Math.floor(Math.random() * 1000),
        caption: `Gambar contoh ${postData.title}`,
        type: "IMAGE",
        width: 600,
        height: 400,
        filename: `example-${postData.slug}.jpg`,
      },
    });

    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: { ...postData, PostMedia: { create: { mediaId: media.id } } },
    });
    console.log("Created post:", post.title);
  }

  // Create sample announcements
  const announcements = [
    {
      title: "Pelabuhan Tanjung Mas Raih Penghargaan Pelabuhan Terbaik 2024",
      summary:
        "Pelabuhan Tanjung Mas berhasil meraih penghargaan sebagai pelabuhan terbaik kategori efisiensi operasional tahun 2024.",
      content:
        "Pelabuhan Tanjung Mas kembali membuktikan keunggulannya dengan meraih penghargaan sebagai pelabuhan terbaik kategori efisiensi operasional tahun 2024. Penghargaan ini diberikan berdasarkan penilaian terhadap kinerja operasional, inovasi teknologi, dan pelayanan kepada pengguna jasa pelabuhan.",
      status: "PUBLISHED" as const,
      linkUrl: null,
      linkText: "Baca Selengkapnya",
      imageUrl:
        "https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=600",
      departmentId: createdDepartments[1].id, // Operations & Logistics
      authorId: admin.id,
    },
    {
      title: "Sistem Baru Online Tracking Container Diluncurkan",
      summary:
        "Mulai hari ini, tracking container dapat dilakukan secara real-time melalui sistem digital terbaru kami.",
      content:
        "Pelabuhan Tanjung Mas meluncurkan sistem tracking container online yang memungkinkan pengguna untuk memantau posisi dan status container secara real-time. Sistem ini menggunakan teknologi GPS dan IoT untuk memberikan informasi yang akurat dan up-to-date.",
      status: "PUBLISHED" as const,
      linkUrl: "/tracking",
      linkText: "Coba Sekarang",
      imageUrl:
        "https://images.pexels.com/photos/163726/belgium-antwerp-port-163726.jpeg?auto=compress&cs=tinysrgb&w=600",
      departmentId: createdDepartments[0].id, // IT & Digital Innovation
      authorId: admin.id,
    },
    {
      title: "Peningkatan Keamanan Cyber Security Pelabuhan",
      summary:
        "Implementasi sistem keamanan siber terbaru untuk melindungi data dan operasional pelabuhan.",
      content:
        "Dalam upaya meningkatkan keamanan data dan operasional, Pelabuhan Tanjung Mas mengimplementasikan sistem keamanan siber terbaru. Sistem ini meliputi firewall canggih, sistem deteksi intrusi, dan enkripsi data end-to-end.",
      status: "PUBLISHED" as const,
      imageUrl:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600",
      departmentId: createdDepartments[0].id, // IT & Digital Innovation
      authorId: moderator.id,
    },
    {
      title: "Event Pelabuhan Terbuka untuk Masyarakat - 15 Juli 2024",
      summary:
        "Bergabunglah dengan kami dalam acara pelabuhan terbuka yang akan menampilkan inovasi terbaru dan teknologi pelabuhan.",
      content:
        "Pelabuhan Tanjung Mas mengundang masyarakat untuk mengikuti acara pelabuhan terbuka pada tanggal 15 Juli 2024. Acara ini akan menampilkan teknologi terbaru, tur fasilitas pelabuhan, dan presentasi mengenai peran pelabuhan dalam ekonomi nasional.",
      status: "PUBLISHED" as const,
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-07-15"),
      linkUrl: "/events/pelabuhan-terbuka-2024",
      linkText: "Daftar Sekarang",
      imageUrl:
        "https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=600",
      departmentId: createdDepartments[3].id, // Customer Service
      authorId: admin.id,
    },
    {
      title: "Maintenance Sistem Informasi - 30 Juni 2024",
      summary:
        "Sistem informasi pelabuhan akan mengalami maintenance pada tanggal 30 Juni 2024 pukul 01:00 - 05:00 WIB.",
      content:
        "Untuk meningkatkan kinerja dan keamanan sistem, kami akan melakukan maintenance rutin pada sistem informasi pelabuhan. Selama periode maintenance, beberapa layanan online mungkin tidak dapat diakses.",
      status: "PUBLISHED" as const,
      startDate: new Date("2024-06-29"),
      endDate: new Date("2024-06-30"),
      imageUrl:
        "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600",
      departmentId: createdDepartments[0].id, // IT & Digital Innovation
      authorId: admin.id,
    },
  ];

  for (const announcementData of announcements) {
    const announcement = await prisma.announcement.create({
      data: announcementData,
    });
    console.log(`Created announcement: ${announcement.title}`);
  }

  console.log("Created sample announcements");

  // Create sample comments
  const posts = await prisma.post.findMany({ take: 3 });

  const sampleComments = [
    {
      content:
        "Great article! Really insightful analysis. Thanks for sharing this valuable information.",
      status: "APPROVED" as const,
    },
    {
      content:
        "I found this very helpful. Looking forward to more content like this.",
      status: "APPROVED" as const,
    },
    {
      content:
        "Interesting perspective on this topic. Well written and informative.",
      status: "APPROVED" as const,
    },
    {
      content:
        "This is exactly what I was looking for. Thank you for the detailed explanation.",
      status: "APPROVED" as const,
    },
    {
      content:
        "Excellent work! The insights provided here are really valuable.",
      status: "APPROVED" as const,
    },
  ];

  for (const post of posts) {
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const commentData =
        sampleComments[Math.floor(Math.random() * sampleComments.length)];
      await prisma.comment.create({
        data: {
          ...commentData,
          postId: post.id,
          authorId: i % 2 === 0 ? admin.id : moderator.id,
        },
      });
    }
  }

  console.log("Created sample comments");

  // Create sample apps
  const sampleApps = [
    {
      name: "Container Tracking System",
      description:
        "Sistem pelacakan container secara real-time dengan teknologi GPS dan IoT.",
      iconUrl:
        "https://images.pexels.com/photos/163726/belgium-antwerp-port-163726.jpeg?auto=compress&cs=tinysrgb&w=100",
      link: "https://tracking.pintumas.id",
    },
    {
      name: "Port Management System",
      description:
        "Sistem manajemen pelabuhan terintegrasi untuk operasional yang lebih efisien.",
      iconUrl:
        "https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=100",
      link: "https://pms.pintumas.id",
    },
    {
      name: "Digital Document Portal",
      description:
        "Portal digital untuk pengelolaan dan akses dokumen pelabuhan.",
      iconUrl:
        "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=100",
      link: "https://docs.pintumas.id",
    },
    {
      name: "Customer Service App",
      description:
        "Aplikasi layanan pelanggan untuk komunikasi dan support yang lebih baik.",
      iconUrl:
        "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100",
      link: "https://cs.pintumas.id",
    },
  ];

  for (const appData of sampleApps) {
    const app = await prisma.apps.upsert({
      where: { name: appData.name },
      update: {},
      create: appData,
    });
    console.log("Created app:", app.name);
  }

  console.log("Created sample apps");

  // Create sample regulations
  const regulations = [
    {
      number: "REG-001/2024",
      title: "Peraturan Kehadiran Pegawai",
      description:
        "Setiap pegawai wajib hadir tepat waktu sesuai dengan jam kerja yang telah ditetapkan. Keterlambatan akan dikenakan sanksi sesuai dengan peraturan yang berlaku. Pegawai yang tidak dapat hadir karena sakit atau keperluan mendadak wajib memberikan pemberitahuan kepada atasan langsung.",
      effectiveDate: new Date("2024-01-01"),
      status: "PUBLISHED" as const,
      departmentId: createdDepartments[4].id, // Human Resources
      attachmentUrl: "https://example.com/peraturan-kehadiran.pdf",
    },
    {
      number: "SOP-002/2024",
      title: "Standar Operasional Prosedur Layanan Publik",
      description:
        "SOP ini mengatur tentang tata cara pelayanan publik yang harus dilaksanakan oleh setiap unit kerja. Pelayanan harus dilakukan dengan prinsip cepat, tepat, transparan, dan akuntabel. Setiap pegawai wajib mengikuti prosedur yang telah ditetapkan dalam memberikan layanan kepada masyarakat.",
      effectiveDate: new Date("2024-02-01"),
      status: "PUBLISHED" as const,
      departmentId: createdDepartments[3].id, // Customer Service
      attachmentUrl: null,
    },
    {
      number: "IT-003/2024",
      title: "Kebijakan Penggunaan Teknologi Informasi",
      description:
        "Kebijakan ini mengatur penggunaan teknologi informasi di lingkungan kerja. Setiap pegawai bertanggung jawab untuk menggunakan fasilitas IT dengan bijak dan sesuai dengan ketentuan yang berlaku. Dilarang menggunakan fasilitas IT untuk kepentingan pribadi yang tidak berkaitan dengan pekerjaan.",
      effectiveDate: new Date("2024-03-01"),
      status: "PUBLISHED" as const,
      departmentId: createdDepartments[0].id, // IT & Digital Innovation
      attachmentUrl: "https://example.com/kebijakan-it.pdf",
    },
    {
      number: "GEN-004/2024",
      title: "Peraturan Umum Organisasi",
      description:
        "Peraturan ini berlaku untuk seluruh pegawai tanpa terkecuali. Mencakup norma-norma dasar, etika kerja, dan aturan umum yang harus dipatuhi oleh setiap anggota organisasi. Pelanggaran terhadap peraturan ini akan dikenakan sanksi sesuai dengan tingkat kesalahan yang dilakukan.",
      effectiveDate: new Date("2024-01-15"),
      status: "PUBLISHED" as const,
      departmentId: null, // Applies to all departments
      attachmentUrl: null,
    },
    {
      number: "DOC-005/2024",
      title: "Prosedur Pengelolaan Dokumen",
      description:
        "SOP ini mengatur tentang tata cara pengelolaan dokumen resmi organisasi. Termasuk di dalamnya adalah prosedur pembuatan, distribusi, penyimpanan, dan pemusnahan dokumen. Setiap dokumen harus diberi kode klasifikasi dan disimpan sesuai dengan sistem kearsipan yang berlaku.",
      effectiveDate: new Date("2024-04-01"),
      status: "DRAFT" as const,
      departmentId: createdDepartments[2].id, // Finance & Administration
      attachmentUrl: "https://example.com/prosedur-dokumen.pdf",
    },
    {
      number: "OPS-006/2024",
      title: "Prosedur Keamanan dan Keselamatan Kerja",
      description:
        "Peraturan ini mengatur tentang prosedur keamanan dan keselamatan kerja yang wajib dipatuhi oleh seluruh pegawai. Mencakup penggunaan alat pelindung diri, prosedur evakuasi darurat, dan pelaporan insiden keselamatan kerja.",
      effectiveDate: new Date("2024-05-01"),
      status: "PUBLISHED" as const,
      departmentId: createdDepartments[1].id, // Operations & Logistics
      attachmentUrl: "https://example.com/keamanan-kerja.pdf",
    },
  ];

  for (const regulationData of regulations) {
    const existingRegulation = await prisma.regulations.findFirst({
      where: { title: regulationData.title },
    });

    if (!existingRegulation) {
      const regulation = await prisma.regulations.create({
        data: regulationData,
      });
      console.log("Created regulation:", regulation.title);
    }
  }

  console.log("Created sample regulations");

  // Create default settings
  console.log("Creating default settings...");

  await prisma.settings.upsert({
    where: { key: "contact_info" },
    update: {},
    create: {
      key: "contact_info",
      value: {
        address:
          "Jl. Coaster No. 7, Tanjung Mas, Semarang Utara, Kota Semarang, Jawa Tengah 50174",
        phone: "+62 (24) 3520073",
        email: "info@pintumas.id",
        workingHours: "Senin - Jumat: 08:00 - 17:00 WIB",
        fax: "+62 (24) 3520074",
      },
    },
  });

  await prisma.settings.upsert({
    where: { key: "social_media" },
    update: {},
    create: {
      key: "social_media",
      value: {
        facebook: "https://facebook.com/pintumas",
        twitter: "https://twitter.com/pintumas",
        instagram: "https://instagram.com/pintumas",
        linkedin: "https://linkedin.com/company/pintumas",
        youtube: "https://youtube.com/@pintumas",
        tiktok: "",
      },
    },
  });

  console.log("Created default settings");

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
