'use client';

import { useState } from 'react';
import { Clock, MessageCircle, Share2, BookmarkPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function LatestNewsSection() {
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Extended articles list with additional content
  const allNewsArticles = [
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
      categoryColor: "bg-purple-500"
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
      categoryColor: "bg-blue-500"
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
      categoryColor: "bg-green-500"
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
      categoryColor: "bg-orange-500"
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
      categoryColor: "bg-teal-500"
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
      categoryColor: "bg-green-600"
    },
    // Additional articles for load more functionality
    {
      id: 7,
      title: "Quantum Computing Breakthrough Accelerates Drug Discovery Process",
      slug: "quantum-computing-breakthrough-accelerates-drug-discovery",
      summary: "Pharmaceutical companies leverage quantum computing to reduce drug development timelines from decades to years.",
      image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Technology",
      author: "Dr. Robert Kim",
      publishedAt: "2 days ago",
      readTime: "6 min read",
      comments: 41,
      categoryColor: "bg-purple-500"
    },
    {
      id: 8,
      title: "International Space Station Achieves Record-Breaking Research Milestone",
      slug: "international-space-station-research-milestone",
      summary: "Astronauts conduct groundbreaking experiments that could revolutionize materials science and medical treatments.",
      image: "https://images.pexels.com/photos/796206/pexels-photo-796206.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Science",
      author: "Commander Lisa Chen",
      publishedAt: "2 days ago",
      readTime: "7 min read",
      comments: 76,
      categoryColor: "bg-teal-500"
    },
    {
      id: 9,
      title: "Sustainable Agriculture Technology Increases Crop Yields by 40%",
      slug: "sustainable-agriculture-technology-increases-crop-yields",
      summary: "Innovative farming techniques combine AI, IoT sensors, and precision agriculture to boost food production sustainably.",
      image: "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Environment",
      author: "Prof. Maria Santos",
      publishedAt: "3 days ago",
      readTime: "5 min read",
      comments: 62,
      categoryColor: "bg-green-600"
    },
    {
      id: 10,
      title: "Central Banks Announce Digital Currency Implementation Timeline",
      slug: "central-banks-digital-currency-implementation",
      summary: "Major economies set concrete dates for rolling out central bank digital currencies, marking a historic shift in monetary systems.",
      image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Business",
      author: "Sarah Johnson",
      publishedAt: "3 days ago",
      readTime: "8 min read",
      comments: 94,
      categoryColor: "bg-blue-500"
    },
    {
      id: 11,
      title: "Mental Health Initiative Launches in Schools Nationwide",
      slug: "mental-health-initiative-schools-nationwide",
      summary: "Comprehensive mental wellness programs roll out across educational institutions, featuring counseling services and mindfulness training.",
      image: "https://images.pexels.com/photos/8923943/pexels-photo-8923943.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Health",
      author: "Dr. Jennifer Lee",
      publishedAt: "4 days ago",
      readTime: "6 min read",
      comments: 38,
      categoryColor: "bg-green-500"
    },
    {
      id: 12,
      title: "Professional Esports League Announces Record Prize Pool",
      slug: "professional-esports-league-record-prize-pool",
      summary: "Gaming industry reaches new heights as competitive tournaments offer unprecedented financial rewards for digital athletes.",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Sports",
      author: "Alex Turner",
      publishedAt: "4 days ago",
      readTime: "4 min read",
      comments: 125,
      categoryColor: "bg-orange-500"
    }
  ];

  // Get articles to display based on current state
  const displayedArticles = allNewsArticles.slice(0, visibleArticles);
  const hasMoreArticles = visibleArticles < allNewsArticles.length;

  // Handle load more functionality
  const handleLoadMore = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Load 3 more articles each time
    setVisibleArticles(prev => Math.min(prev + 3, allNewsArticles.length));
    setIsLoading(false);
  };

  return (
    <section className="py-16 bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Berita Terkini</h2>
            <p className="text-lg text-gray-600">
              Tetap terkini dengan perkembangan terbaru dari Pelabuhan Tanjung Mas
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
              Lihat Semua Berita
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/post/${article.slug}`}
              className="block"
            >
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
                    <span>Oleh {article.author}</span>
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

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle bookmark functionality
                          console.log('Bookmarked:', article.title);
                        }}
                      >
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle share functionality
                          if (navigator.share) {
                            navigator.share({
                              title: article.title,
                              text: article.summary,
                              url: `/post/${article.slug}`
                            });
                          } else {
                            // Fallback - copy to clipboard
                            navigator.clipboard.writeText(`${window.location.origin}/post/${article.slug}`);
                            console.log('Link copied to clipboard');
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Progress Indicator */}
        {visibleArticles > 6 && (
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <span className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-yellow-600">{visibleArticles}</span> dari <span className="font-semibold">{allNewsArticles.length}</span> artikel
              </span>
            </div>
          </div>
        )}

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
                  Memuat Lebih Banyak...
                </>
              ) : (
                <>
                  Muat Lebih Banyak Artikel
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                    {allNewsArticles.length - visibleArticles} lagi
                  </span>
                </>
              )}
            </Button>
          ) : (
            <div className="text-gray-500">
              <p className="text-lg font-medium mb-2">Anda telah mencapai akhir!</p>
              <p className="text-sm">
                Menampilkan semua {allNewsArticles.length} artikel. Periksa kembali nanti untuk berita lebih lanjut.
              </p>
              <Link href="/news" className="inline-block mt-4">
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  Lihat Semua Arsip Berita
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}