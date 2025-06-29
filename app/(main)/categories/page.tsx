'use client';

import { useState } from 'react';
import { ArrowLeft, Search, TrendingUp, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AllCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      name: 'Business',
      slug: 'business',
      description: 'Corporate news, market trends, finance, startups, and economic developments from around the world.',
      color: 'bg-blue-500',
      articles: 1247,
      trending: true,
      recentArticles: [
        'Global Markets Surge as Trade Agreements Reach Final Negotiations',
        'Tech Giants Report Record Q4 Earnings Despite Market Volatility',
        'Cryptocurrency Adoption Accelerates in Emerging Markets'
      ]
    },
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Latest developments in AI, software, hardware, cybersecurity, and digital innovation.',
      color: 'bg-purple-500',
      articles: 892,
      trending: true,
      recentArticles: [
        'Revolutionary AI Algorithm Predicts Weather Patterns with 95% Accuracy',
        'Quantum Computing Reaches New Milestone in Processing Power',
        'Breakthrough in Sustainable Battery Technology'
      ]
    },
    {
      name: 'Health',
      slug: 'health',
      description: 'Medical breakthroughs, wellness trends, healthcare policy, and public health updates.',
      color: 'bg-green-500',
      articles: 634,
      trending: false,
      recentArticles: [
        'Breakthrough Gene Therapy Shows Promise for Treating Rare Diseases',
        'New Study Reveals Benefits of Mediterranean Diet',
        'Mental Health Awareness Campaigns Show Positive Results'
      ]
    },
    {
      name: 'World',
      slug: 'world',
      description: 'International news, politics, diplomacy, conflicts, and global affairs coverage.',
      color: 'bg-indigo-500',
      articles: 1156,
      trending: true,
      recentArticles: [
        'Global Climate Summit Reaches Historic Agreement',
        'International Trade Relations Show Signs of Improvement',
        'Humanitarian Crisis Response Efforts Intensify'
      ]
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Sports news, athlete profiles, game results, and major sporting events coverage.',
      color: 'bg-orange-500',
      articles: 743,
      trending: false,
      recentArticles: [
        'Olympic Champions Prepare for World Athletics Championships',
        'Football Transfer Window Sees Record-Breaking Deals',
        'Tennis Grand Slam Tournament Delivers Thrilling Matches'
      ]
    },
    {
      name: 'Science',
      slug: 'science',
      description: 'Scientific discoveries, research findings, space exploration, and environmental studies.',
      color: 'bg-teal-500',
      articles: 521,
      trending: false,
      recentArticles: [
        'Archaeological Discovery Reveals Ancient Civilization Secrets',
        'Space Technology Advances Enable Mars Mission Preparations',
        'Climate Research Shows Accelerating Environmental Changes'
      ]
    },
    {
      name: 'Politics',
      slug: 'politics',
      description: 'Political developments, elections, policy changes, and government affairs.',
      color: 'bg-red-500',
      articles: 934,
      trending: true,
      recentArticles: [
        'Election Results Shape Future Policy Directions',
        'Legislative Changes Impact Healthcare and Education',
        'International Diplomatic Relations Undergo Significant Shifts'
      ]
    },
    {
      name: 'Culture',
      slug: 'culture',
      description: 'Arts, entertainment, lifestyle, social trends, and cultural developments.',
      color: 'bg-pink-500',
      articles: 412,
      trending: false,
      recentArticles: [
        'Film Festival Showcases Emerging International Talent',
        'Cultural Heritage Sites Receive UNESCO Recognition',
        'Social Media Trends Influence Modern Art Movements'
      ]
    },
    {
      name: 'Environment',
      slug: 'environment',
      description: 'Climate change, sustainability, conservation, renewable energy, and environmental policy.',
      color: 'bg-green-600',
      articles: 387,
      trending: true,
      recentArticles: [
        'Renewable Energy Initiative Powers Entire City for First Time',
        'Ocean Conservation Efforts Show Promising Results',
        'Sustainable Agriculture Practices Gain Global Adoption'
      ]
    },
    {
      name: 'Education',
      slug: 'education',
      description: 'Educational innovations, academic research, student life, and learning technologies.',
      color: 'bg-yellow-600',
      articles: 298,
      trending: false,
      recentArticles: [
        'Online Learning Platforms Transform Higher Education',
        'STEM Education Programs Show Increased Student Engagement',
        'Educational Technology Bridges Learning Gaps'
      ]
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingCategories = categories.filter(cat => cat.trending);
  const totalArticles = categories.reduce((sum, cat) => sum + cat.articles, 0);

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
          All Categories
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Explore news across all topics and discover stories that matter to you.
          From breaking news to in-depth analysis, find everything in one place.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalArticles.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{trendingCategories.length}</div>
            <div className="text-sm text-gray-500">Trending</div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Trending Categories */}
      {!searchTerm && (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Trending Categories</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCategories.slice(0, 6).map((category, index) => (
              <Link key={index} href={`/category/${category.slug}`}>
                <div className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-300 hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-yellow-500 text-black font-semibold">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{category.articles.toLocaleString()} articles</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Updated daily</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchTerm ? `Search Results (${filteredCategories.length})` : 'All Categories'}
        </h2>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredCategories.map((category, index) => (
              <Link key={index} href={`/category/${category.slug}`}>
                <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-yellow-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors duration-200">
                            {category.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{category.articles.toLocaleString()} articles</span>
                            {category.trending && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Articles:</h4>
                      <ul className="space-y-2">
                        {category.recentArticles.slice(0, 3).map((article, articleIndex) => (
                          <li key={articleIndex} className="text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200 line-clamp-1">
                            • {article}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Button variant="outline" className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                        Explore {category.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}