import { ArrowLeft, Clock, Eye, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import NewsGridClient from './NewsGridClient';

export default function NewsPage() {
  // Extended news articles list
  const allNews = [
    {
      id: 1,
      title: "Revolutionary AI Algorithm Predicts Weather Patterns with 95% Accuracy",
      slug: "revolutionary-ai-algorithm-predicts-weather-patterns",
      summary: "Scientists develop groundbreaking machine learning model that could transform meteorological forecasting and climate research worldwide.",
      image: "https://images.pexels.com/photos/1422286/pexels-photo-1422286.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Technology",
      author: "Dr. Emily Chen",
      publishedAt: "3 hours ago",
      readTime: "7 min read",
      comments: 45,
      views: "12.4K",
      categoryColor: "bg-purple-500",
      featured: true
    },
    {
      id: 2,
      title: "Global Markets Surge as Trade Agreements Reach Final Negotiations",
      slug: "global-markets-surge-trade-agreements-final-negotiations",
      summary: "International trade talks show promising results as major economies prepare to sign comprehensive partnership agreements this quarter.",
      image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Business",
      author: "Michael Rodriguez",
      publishedAt: "5 hours ago",
      readTime: "5 min read",
      comments: 32,
      views: "8.7K",
      categoryColor: "bg-blue-500",
      featured: false
    },
    {
      id: 3,
      title: "Breakthrough Gene Therapy Shows Promise for Treating Rare Diseases",
      slug: "breakthrough-gene-therapy-shows-promise",
      summary: "Clinical trials reveal significant improvements in patients with genetic disorders, offering hope for previously untreatable conditions.",
      image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Health",
      author: "Dr. Sarah Williams",
      publishedAt: "8 hours ago",
      readTime: "6 min read",
      comments: 28,
      views: "6.3K",
      categoryColor: "bg-green-500",
      featured: false
    },
    {
      id: 4,
      title: "Olympic Champions Prepare for World Athletics Championships",
      slug: "olympic-champions-prepare-world-athletics-championships",
      summary: "Elite athletes from around the globe gather as preparations intensify for what promises to be the most competitive championship in decades.",
      image: "https://images.pexels.com/photos/209969/pexels-photo-209969.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Sports",
      author: "James Thompson",
      publishedAt: "12 hours ago",
      readTime: "4 min read",
      comments: 67,
      views: "15.2K",
      categoryColor: "bg-orange-500",
      featured: false
    },
    {
      id: 5,
      title: "Archaeological Discovery Reveals Ancient Civilization Secrets",
      slug: "archaeological-discovery-reveals-ancient-civilization-secrets",
      summary: "Recent excavations uncover sophisticated urban planning and advanced technologies from a previously unknown ancient society.",
      image: "https://images.pexels.com/photos/17486/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
      category: "Science",
      author: "Prof. Anna Martinez",
      publishedAt: "1 day ago",
      readTime: "8 min read",
      comments: 53,
      views: "9.8K",
      categoryColor: "bg-teal-500",
      featured: false
    },
    {
      id: 6,
      title: "Renewable Energy Initiative Powers Entire City for First Time",
      slug: "renewable-energy-initiative-powers-entire-city",
      summary: "Landmark achievement in sustainable energy as solar and wind infrastructure successfully meets 100% of urban energy demands.",
      image: "https://images.pexels.com/photos/371900/pexels-photo-371900.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Environment",
      author: "David Park",
      publishedAt: "1 day ago",
      readTime: "5 min read",
      comments: 89,
      views: "18.5K",
      categoryColor: "bg-green-600",
      featured: false
    },
    {
      id: 7,
      title: "Quantum Computing Breakthrough Promises Faster Drug Discovery",
      slug: "quantum-computing-breakthrough-faster-drug-discovery",
      summary: "Researchers harness quantum computing power to accelerate pharmaceutical research and development processes.",
      image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Technology",
      author: "Dr. Robert Kim",
      publishedAt: "2 days ago",
      readTime: "6 min read",
      comments: 41,
      views: "7.9K",
      categoryColor: "bg-purple-500",
      featured: false
    },
    {
      id: 8,
      title: "Space Mission Successfully Deploys Advanced Satellite Network",
      slug: "space-mission-deploys-advanced-satellite-network",
      summary: "Latest space mission establishes global communication infrastructure with unprecedented coverage and reliability.",
      image: "https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Science",
      author: "Commander Lisa Chen",
      publishedAt: "2 days ago",
      readTime: "7 min read",
      comments: 76,
      views: "22.1K",
      categoryColor: "bg-teal-500",
      featured: false
    }
  ];

  const featuredNews = allNews.filter(article => article.featured);
  const regularNews = allNews.filter(article => !article.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          All News
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay informed with comprehensive coverage of the latest developments from around the world
        </p>
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Story</h2>
          {featuredNews.map((article) => (
            <Link key={article.id} href={`/post/${article.slug}`} className="block">
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 lg:p-12">
                    <Badge className={`${article.categoryColor} text-white mb-4`}>
                      {article.category}
                    </Badge>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-yellow-700 transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>By {article.author}</span>
                        <span className="mx-2">•</span>
                        <span>{article.publishedAt}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
        <div className="flex items-center space-x-4">
          <Select defaultValue="latest">
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* News Grid with Load More Functionality */}
      <NewsGridClient initialArticles={allNews} />
    </div>
  );
}
