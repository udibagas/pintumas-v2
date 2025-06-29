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

  // Create categories
  const categories = [
    {
      name: "Business",
      slug: "business",
      description: "Business news and market trends",
      color: "bg-blue-500",
    },
    {
      name: "Technology",
      slug: "technology",
      description: "Latest tech developments",
      color: "bg-purple-500",
    },
    {
      name: "Health",
      slug: "health",
      description: "Health and wellness news",
      color: "bg-green-500",
    },
    {
      name: "World",
      slug: "world",
      description: "Global news and international affairs",
      color: "bg-indigo-500",
    },
    {
      name: "Sports",
      slug: "sports",
      description: "Sports news and updates",
      color: "bg-orange-500",
    },
    {
      name: "Science",
      slug: "science",
      description: "Scientific discoveries and research",
      color: "bg-teal-500",
    },
    {
      name: "Politics",
      slug: "politics",
      description: "Political news and government updates",
      color: "bg-red-500",
    },
    {
      name: "Culture",
      slug: "culture",
      description: "Arts, culture, and entertainment",
      color: "bg-pink-500",
    },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    console.log("Created category:", category.name);
  }

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
  const techCategory = await prisma.category.findUnique({
    where: { slug: "technology" },
  });
  const businessCategory = await prisma.category.findUnique({
    where: { slug: "business" },
  });

  if (techCategory && businessCategory) {
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
        readTime: "5 min read",
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: techCategory.id,
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
        readTime: "4 min read",
        publishedAt: new Date(),
        authorId: moderator.id,
        categoryId: businessCategory.id,
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
        readTime: "6 min read",
        authorId: admin.id,
        categoryId: businessCategory.id,
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

    // Create sample announcement posts
    const announcementPosts = [
      {
        title: "Pelabuhan Tanjung Mas Raih Penghargaan Pelabuhan Terbaik 2024",
        slug: "penghargaan-pelabuhan-terbaik-2024",
        summary:
          "Pelabuhan Tanjung Mas berhasil meraih penghargaan sebagai pelabuhan terbaik kategori efisiensi operasional tahun 2024.",
        content:
          "Pelabuhan Tanjung Mas kembali membuktikan keunggulannya dengan meraih penghargaan sebagai pelabuhan terbaik kategori efisiensi operasional tahun 2024. Penghargaan ini diberikan berdasarkan penilaian terhadap kinerja operasional, inovasi teknologi, dan pelayanan kepada pengguna jasa pelabuhan.",
        status: "PUBLISHED" as const,
        isAnnouncement: true,
        announcementType: "BREAKING" as const,
        priority: 4,
        linkUrl: null,
        linkText: "Baca Selengkapnya",
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: businessCategory.id,
      },
      {
        title: "Sistem Baru Online Tracking Container Diluncurkan",
        slug: "sistem-tracking-container-baru",
        summary:
          "Mulai hari ini, tracking container dapat dilakukan secara real-time melalui sistem digital terbaru kami.",
        content:
          "Pelabuhan Tanjung Mas meluncurkan sistem tracking container online yang memungkinkan pengguna untuk memantau posisi dan status container secara real-time. Sistem ini menggunakan teknologi GPS dan IoT untuk memberikan informasi yang akurat dan up-to-date.",
        status: "PUBLISHED" as const,
        isAnnouncement: true,
        announcementType: "INFO" as const,
        priority: 3,
        linkUrl: "/tracking",
        linkText: "Coba Sekarang",
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: techCategory.id,
      },
      {
        title: "Peningkatan Keamanan Cyber Security Pelabuhan",
        slug: "peningkatan-cyber-security",
        summary:
          "Implementasi sistem keamanan siber terbaru untuk melindungi data dan operasional pelabuhan.",
        content:
          "Dalam upaya meningkatkan keamanan data dan operasional, Pelabuhan Tanjung Mas mengimplementasikan sistem keamanan siber terbaru. Sistem ini meliputi firewall canggih, sistem deteksi intrusi, dan enkripsi data end-to-end.",
        status: "PUBLISHED" as const,
        isAnnouncement: true,
        announcementType: "ALERT" as const,
        priority: 3,
        publishedAt: new Date(),
        authorId: moderator.id,
        categoryId: techCategory.id,
      },
      {
        title: "Event Pelabuhan Terbuka untuk Masyarakat - 15 Juli 2024",
        slug: "pelabuhan-terbuka-2024",
        summary:
          "Bergabunglah dengan kami dalam acara pelabuhan terbuka yang akan menampilkan inovasi terbaru dan teknologi pelabuhan.",
        content:
          "Pelabuhan Tanjung Mas mengundang masyarakat untuk mengikuti acara pelabuhan terbuka pada tanggal 15 Juli 2024. Acara ini akan menampilkan teknologi terbaru, tur fasilitas pelabuhan, dan presentasi mengenai peran pelabuhan dalam ekonomi nasional.",
        status: "PUBLISHED" as const,
        isAnnouncement: true,
        announcementType: "EVENT" as const,
        priority: 2,
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-07-15"),
        linkUrl: "/events/pelabuhan-terbuka-2024",
        linkText: "Daftar Sekarang",
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: businessCategory.id,
      },
      {
        title: "Maintenance Sistem Informasi - 30 Juni 2024",
        slug: "maintenance-sistem-informasi-juni",
        summary:
          "Sistem informasi pelabuhan akan mengalami maintenance pada tanggal 30 Juni 2024 pukul 01:00 - 05:00 WIB.",
        content:
          "Untuk meningkatkan kinerja dan keamanan sistem, kami akan melakukan maintenance rutin pada sistem informasi pelabuhan. Selama periode maintenance, beberapa layanan online mungkin tidak dapat diakses.",
        status: "PUBLISHED" as const,
        isAnnouncement: true,
        announcementType: "MAINTENANCE" as const,
        priority: 2,
        startDate: new Date("2024-06-29"),
        endDate: new Date("2024-06-30"),
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: techCategory.id,
      },
    ];

    for (const postData of announcementPosts) {
      const post = await prisma.post.create({
        data: postData,
      });
      console.log(`Created announcement post: ${post.title}`);
    }

    console.log("Created sample announcement posts");
  }

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
