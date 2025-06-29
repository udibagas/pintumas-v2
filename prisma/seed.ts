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
        image:
          "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600",
        status: "PUBLISHED",
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
        image:
          "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
        status: "PUBLISHED",
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
        image:
          "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=600",
        status: "DRAFT",
        featured: false,
        readTime: "6 min read",
        authorId: admin.id,
        categoryId: businessCategory.id,
      },
    ];

    for (const postData of samplePosts) {
      const post = await prisma.post.upsert({
        where: { slug: postData.slug },
        update: {},
        create: postData,
      });
      console.log("Created post:", post.title);
    }
  }

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
