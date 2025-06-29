import { ArrowLeft, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import CategoryPageClient from './CategoryPageClient';
import Image from 'next/image';

// Generate static params for all possible category slugs
export async function generateStaticParams() {
  return [
    { slug: 'business' },
    { slug: 'technology' },
    { slug: 'health' },
    { slug: 'world' },
    { slug: 'sports' },
    { slug: 'science' },
    { slug: 'politics' },
    { slug: 'culture' },
  ];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {

  // Mock category data - in real app, this would come from API/database
  const categoryData = {
    business: {
      name: 'Business',
      description: 'Business news, market trends, finance, and economic developments',
      color: 'bg-blue-500',
      articleCount: 1247
    },
    technology: {
      name: 'Technology',
      description: 'Latest developments in technology, AI, software, and digital innovation',
      color: 'bg-purple-500',
      articleCount: 892
    },
    health: {
      name: 'Health',
      description: 'Health news, medical breakthroughs, wellness, and healthcare updates',
      color: 'bg-green-500',
      articleCount: 634
    },
    world: {
      name: 'World',
      description: 'Global news, international affairs, and worldwide developments',
      color: 'bg-indigo-500',
      articleCount: 1156
    },
    sports: {
      name: 'Sports',
      description: 'Sports news, match results, player updates, and athletic achievements',
      color: 'bg-orange-500',
      articleCount: 743
    },
    science: {
      name: 'Science',
      description: 'Scientific discoveries, research breakthroughs, and academic developments',
      color: 'bg-teal-500',
      articleCount: 521
    },
    politics: {
      name: 'Politics',
      description: 'Political news, government updates, policy changes, and civic matters',
      color: 'bg-red-500',
      articleCount: 934
    },
    culture: {
      name: 'Culture',
      description: 'Cultural events, arts, entertainment, and social trends',
      color: 'bg-pink-500',
      articleCount: 412
    }
  };

  const category = categoryData[params.slug as keyof typeof categoryData] || categoryData.business;

  const articles = [
    {
      id: 1,
      title: "Revolutionary AI Algorithm Predicts Weather Patterns with 95% Accuracy",
      slug: "revolutionary-ai-algorithm-predicts-weather-patterns",
      summary: "Scientists develop groundbreaking machine learning model that could transform meteorological forecasting and climate research worldwide.",
      image: "https://images.pexels.com/photos/1422286/pexels-photo-1422286.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Emily Chen",
      publishedAt: "3 hours ago",
      readTime: "7 min read",
      views: "12.4K",
      comments: 45,
      featured: true
    },
    {
      id: 2,
      title: "Breakthrough Gene Therapy Shows Promise for Treating Rare Diseases",
      slug: "breakthrough-gene-therapy-shows-promise",
      summary: "Clinical trials reveal significant improvements in patients with genetic disorders, offering hope for previously untreatable conditions.",
      image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Sarah Williams",
      publishedAt: "5 hours ago",
      readTime: "6 min read",
      views: "8.2K",
      comments: 28,
      featured: false
    },
    {
      id: 3,
      title: "Quantum Computing Reaches New Milestone in Processing Power",
      slug: "quantum-computing-reaches-new-milestone",
      summary: "Latest quantum processor demonstrates unprecedented computational capabilities, bringing practical quantum computing closer to reality.",
      image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Prof. Michael Zhang",
      publishedAt: "8 hours ago",
      readTime: "8 min read",
      views: "15.7K",
      comments: 67,
      featured: false
    },
    {
      id: 4,
      title: "Sustainable Energy Storage Solution Revolutionizes Grid Systems",
      slug: "sustainable-energy-storage-solution-revolutionizes-grid-systems",
      summary: "New battery technology promises to solve renewable energy storage challenges with unprecedented efficiency and longevity.",
      image: "https://images.pexels.com/photos/371900/pexels-photo-371900.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Lisa Park",
      publishedAt: "12 hours ago",
      readTime: "5 min read",
      views: "9.8K",
      comments: 34,
      featured: false
    },
    {
      id: 5,
      title: "Machine Learning Transforms Medical Diagnosis Accuracy",
      slug: "machine-learning-transforms-medical-diagnosis-accuracy",
      summary: "AI-powered diagnostic tools show remarkable improvement in early disease detection, potentially saving millions of lives.",
      image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. James Rodriguez",
      publishedAt: "1 day ago",
      readTime: "6 min read",
      views: "11.3K",
      comments: 52,
      featured: false
    },
    {
      id: 6,
      title: "Space Technology Advances Enable Mars Mission Preparations",
      slug: "space-technology-advances-enable-mars-mission-preparations",
      summary: "Latest developments in spacecraft technology and life support systems bring human Mars exploration closer to reality.",
      image: "https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Anna Thompson",
      publishedAt: "1 day ago",
      readTime: "7 min read",
      views: "13.9K",
      comments: 78,
      featured: false
    }
  ];

  const featuredArticle = articles.find(article => article.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      {/* Category Header */}
      <div className="text-center mb-12">
        <div className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
          <div className="w-10 h-10 bg-white rounded-full"></div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {category.description}
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>{category.articleCount.toLocaleString()} articles</span>
          <span>•</span>
          <span>Updated daily</span>
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Badge className="bg-yellow-500 text-black font-semibold">Featured</Badge>
            <h2 className="text-2xl font-bold text-gray-900">Editors Pick</h2>
          </div>
          <Link href={`/post/${featuredArticle.slug}`} className="block">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer">
              <div className="aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
                <Image
                  width={800}
                  height={450}
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-yellow-300 transition-colors duration-200">
                  {featuredArticle.title}
                </h3>
                <p className="text-gray-200 text-lg mb-6 line-clamp-2">
                  {featuredArticle.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-gray-300 text-sm">
                    <span>By {featuredArticle.author}</span>
                    <span>{featuredArticle.publishedAt}</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{featuredArticle.views}</span>
                    </div>
                  </div>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Read Article
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Articles List with Client-side Interactions */}
      <CategoryPageClient articles={articles} />

    </div>
  );
}