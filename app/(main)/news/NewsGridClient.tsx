'use client';

import { useState } from 'react';
import { Clock, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  comments: number;
  views: string;
  categoryColor: string;
  featured: boolean;
}

interface NewsGridClientProps {
  initialArticles: Article[];
}

export default function NewsGridClient({ initialArticles }: NewsGridClientProps) {
  const [visibleArticles, setVisibleArticles] = useState(7); // Start with 7 (excluding featured)
  const [isLoading, setIsLoading] = useState(false);

  // Extended articles dataset for load more functionality
  const allAdditionalArticles: Article[] = [
    {
      id: 9,
      title: "Sustainable Agriculture Revolution Transforms Food Production",
      slug: "sustainable-agriculture-revolution-transforms-food-production",
      summary: "Innovative farming techniques combining AI, IoT sensors, and precision agriculture boost yields while reducing environmental impact.",
      image: "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Environment",
      author: "Prof. Maria Santos",
      publishedAt: "3 days ago",
      readTime: "5 min read",
      comments: 62,
      views: "11.2K",
      categoryColor: "bg-green-600",
      featured: false
    },
    {
      id: 10,
      title: "Digital Currency Adoption Reaches Milestone in Global Markets",
      slug: "digital-currency-adoption-reaches-milestone-global-markets",
      summary: "Central bank digital currencies gain traction as major economies implement comprehensive blockchain-based financial systems.",
      image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Business",
      author: "David Williams",
      publishedAt: "3 days ago",
      readTime: "8 min read",
      comments: 87,
      views: "19.6K",
      categoryColor: "bg-blue-500",
      featured: false
    },
    {
      id: 11,
      title: "Mental Health Technology Platform Launches Nationwide",
      slug: "mental-health-technology-platform-launches-nationwide",
      summary: "Comprehensive digital wellness platform provides accessible mental health resources and AI-powered therapy sessions.",
      image: "https://images.pexels.com/photos/8923943/pexels-photo-8923943.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Health",
      author: "Dr. Jennifer Adams",
      publishedAt: "4 days ago",
      readTime: "6 min read",
      comments: 43,
      views: "8.9K",
      categoryColor: "bg-green-500",
      featured: false
    },
    {
      id: 12,
      title: "Virtual Reality Training Programs Transform Professional Education",
      slug: "virtual-reality-training-programs-transform-professional-education",
      summary: "Immersive VR platforms revolutionize medical, engineering, and technical training with realistic simulations and hands-on experience.",
      image: "https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Technology",
      author: "Prof. Michael Chang",
      publishedAt: "4 days ago",
      readTime: "7 min read",
      comments: 59,
      views: "14.8K",
      categoryColor: "bg-purple-500",
      featured: false
    },
    {
      id: 13,
      title: "International Climate Cooperation Reaches Historic Agreement",
      slug: "international-climate-cooperation-reaches-historic-agreement",
      summary: "World leaders unite on unprecedented environmental protection measures with binding commitments and innovative funding mechanisms.",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Environment",
      author: "Dr. Elena Rodriguez",
      publishedAt: "5 days ago",
      readTime: "9 min read",
      comments: 156,
      views: "31.7K",
      categoryColor: "bg-green-600",
      featured: false
    },
    {
      id: 14,
      title: "Next-Generation Esports Arena Opens with Advanced Broadcasting",
      slug: "next-generation-esports-arena-opens-advanced-broadcasting",
      summary: "State-of-the-art gaming facility features holographic displays, 360-degree cameras, and immersive spectator experiences.",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Sports",
      author: "Jordan Martinez",
      publishedAt: "5 days ago",
      readTime: "4 min read",
      comments: 92,
      views: "17.3K",
      categoryColor: "bg-orange-500",
      featured: false
    },
    {
      id: 15,
      title: "Breakthrough Cancer Treatment Shows 90% Success Rate",
      slug: "breakthrough-cancer-treatment-shows-ninety-percent-success-rate",
      summary: "Revolutionary immunotherapy approach combines gene editing with personalized medicine to achieve remarkable patient outcomes.",
      image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Health",
      author: "Dr. Sarah Mitchell",
      publishedAt: "6 days ago",
      readTime: "10 min read",
      comments: 203,
      views: "45.2K",
      categoryColor: "bg-green-500",
      featured: false
    },
    {
      id: 16,
      title: "Smart City Infrastructure Project Completes First Phase",
      slug: "smart-city-infrastructure-project-completes-first-phase",
      summary: "Urban transformation initiative integrates IoT sensors, renewable energy, and AI-driven traffic management systems.",
      image: "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Technology",
      author: "Urban Planner Alex Kim",
      publishedAt: "6 days ago",
      readTime: "8 min read",
      comments: 74,
      views: "13.5K",
      categoryColor: "bg-purple-500",
      featured: false
    }
  ];

  // Filter out featured articles for regular display
  const regularArticles = initialArticles.filter(article => !article.featured);
  const allRegularArticles = [...regularArticles, ...allAdditionalArticles];

  // Get articles to display
  const displayedArticles = allRegularArticles.slice(0, visibleArticles);
  const hasMoreArticles = visibleArticles < allRegularArticles.length;

  // Handle load more functionality
  const handleLoadMore = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Load 3 more articles each time
    setVisibleArticles(prev => Math.min(prev + 3, allRegularArticles.length));
    setIsLoading(false);
  };

  return (
    <>
      {/* Progress Indicator */}
      {visibleArticles > 7 && (
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg border">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-yellow-600">{visibleArticles}</span> of <span className="font-semibold">{allRegularArticles.length}</span> articles
            </span>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {displayedArticles.map((article, index) => (
          <Link key={article.id} href={`/post/${article.slug}`} className="block">
            <article
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
              style={{
                animationDelay: `${(index % 3) * 100}ms`,
                animation: index >= visibleArticles - 3 && !isLoading ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${article.categoryColor} text-white font-semibold`}>
                    {article.category}
                  </Badge>
                </div>
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

      {/* Load More Button */}
      <div className="text-center">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You&apos;ve seen it all!</h3>
              <p className="text-gray-600 mb-4">
                You&apos;ve viewed all {allRegularArticles.length} articles in our news archive.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  Back to Home
                </Button>
              </Link>
              <Link href="/categories">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                  Browse Categories
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
      `}</style>
    </>
  );
}
