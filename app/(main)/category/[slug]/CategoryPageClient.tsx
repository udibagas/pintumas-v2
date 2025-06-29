'use client';

import { useState } from 'react';
import { Filter, Grid, List, Clock, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: string;
  views: string;
  comments: number;
  featured: boolean;
}

interface CategoryPageClientProps {
  articles: Article[];
}

export default function CategoryPageClient({ articles }: CategoryPageClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Extended articles dataset for load more functionality
  const allAdditionalArticles: Article[] = [
    {
      id: 7,
      title: "Advanced Neural Networks Transform Computer Vision",
      slug: "advanced-neural-networks-transform-computer-vision",
      summary: "Deep learning breakthroughs enable unprecedented accuracy in image recognition and automated visual analysis systems.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Rachel Kim",
      publishedAt: "2 days ago",
      readTime: "6 min read",
      views: "7.5K",
      comments: 41,
      featured: false
    },
    {
      id: 8,
      title: "Cybersecurity Innovation Protects Critical Infrastructure",
      slug: "cybersecurity-innovation-protects-critical-infrastructure",
      summary: "Next-generation security protocols and AI-driven threat detection systems safeguard essential digital networks.",
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Prof. David Wilson",
      publishedAt: "3 days ago",
      readTime: "8 min read",
      views: "12.1K",
      comments: 63,
      featured: false
    },
    {
      id: 9,
      title: "Biotechnology Advances Enable Personalized Medicine",
      slug: "biotechnology-advances-enable-personalized-medicine",
      summary: "Genetic profiling and targeted therapies revolutionize treatment approaches for complex medical conditions.",
      image: "https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Maria Gonzalez",
      publishedAt: "3 days ago",
      readTime: "7 min read",
      views: "9.8K",
      comments: 37,
      featured: false
    },
    {
      id: 10,
      title: "Smart City Technologies Improve Urban Living",
      slug: "smart-city-technologies-improve-urban-living",
      summary: "IoT sensors, data analytics, and automated systems optimize traffic flow, energy usage, and public services.",
      image: "https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Jennifer Lee",
      publishedAt: "4 days ago",
      readTime: "5 min read",
      views: "8.7K",
      comments: 29,
      featured: false
    },
    {
      id: 11,
      title: "Virtual Reality Applications Expand Beyond Gaming",
      slug: "virtual-reality-applications-expand-beyond-gaming",
      summary: "VR technology finds new applications in education, healthcare, training, and professional collaboration.",
      image: "https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Alex Turner",
      publishedAt: "4 days ago",
      readTime: "6 min read",
      views: "11.4K",
      comments: 58,
      featured: false
    },
    {
      id: 12,
      title: "Autonomous Vehicle Technology Reaches New Milestones",
      slug: "autonomous-vehicle-technology-reaches-new-milestones",
      summary: "Self-driving cars demonstrate improved safety features and navigation capabilities in comprehensive testing programs.",
      image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Thomas Chen",
      publishedAt: "5 days ago",
      readTime: "7 min read",
      views: "13.2K",
      comments: 72,
      featured: false
    }
  ];

  const regularArticles = articles.filter(article => !article.featured);
  const allRegularArticles = [...regularArticles, ...allAdditionalArticles];
  const displayedArticles = allRegularArticles.slice(0, visibleArticles);
  const hasMoreArticles = visibleArticles < allRegularArticles.length;

  // Handle load more functionality
  const handleLoadMore = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Load 3 more articles each time
    setVisibleArticles(prev => Math.min(prev + 3, allRegularArticles.length));
    setIsLoading(false);
  };

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Articles Grid/List */}
      <section>
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article, index) => (
              <Link key={article.id} href={`/post/${article.slug}`} className="block">
                <article
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1 ${index >= visibleArticles - 3 && visibleArticles > 6 ? 'animate-fadeInUp' : ''
                    }`}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      width={800}
                      height={450}
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>By {article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-yellow-700 transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedArticles.map((article, index) => (
              <Link key={article.id} href={`/post/${article.slug}`} className="block">
                <article
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${index >= visibleArticles - 3 && visibleArticles > 6 ? 'animate-fadeInUp' : ''
                    }`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Image
                        width={800}
                        height={450}
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>By {article.author}</span>
                        <span className="mx-2">•</span>
                        <span>{article.publishedAt}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-700 transition-colors duration-200">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span>{article.comments}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Progress Indicator */}
      {visibleArticles > 6 && (
        <div className="flex items-center justify-center my-8">
          <div className="bg-white rounded-full px-4 py-2 shadow-md">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-yellow-600">{visibleArticles}</span> of <span className="font-semibold">{allRegularArticles.length}</span> articles
            </span>
          </div>
        </div>
      )}

      {/* Load More Section */}
      <div className="text-center mt-12">
        {hasMoreArticles ? (
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading More Articles...
              </>
            ) : (
              <>
                Load More Articles
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {allRegularArticles.length - visibleArticles} more
                </span>
              </>
            )}
          </Button>
        ) : (
          <div className="text-gray-500">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You&apos;ve explored everything!</h3>
              <p className="text-gray-600 mb-4">
                You&apos;ve viewed all {allRegularArticles.length} articles in this category.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  Back to Home
                </Button>
              </Link>
              <Link href="/news">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                  Browse All News
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
