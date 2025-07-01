import { ArrowLeft, Clock, Eye, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import NewsGridClient from './NewsGridClient';
import { formatTimeAgo, formatViews } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  category: string;
  categorySlug: string;
  categoryColor?: string;
  readTime: string;
  views: number;
  author: string;
  publishedAt: string | Date;
  createdAt: string | Date;
  featured: boolean;
  comments: number;
}

async function getPosts() {
  try {
    // Build where clause - only published posts
    const where = {
      status: 'PUBLISHED' as const,
    };

    // Get posts with their categories and authors, including comment count
    const posts = await prisma.post.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }],
      take: 20,
    });

    // Transform the data to match the expected format
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary || "",
      image: post.imageUrl || "/images/default-avatar.png",
      category: post.category.name,
      categorySlug: post.category.slug,
      categoryColor: post.category.color || undefined,
      readTime: post.readTime || "5 min read",
      views: post.views || 0,
      author: post.author.name,
      publishedAt: post.publishedAt || post.createdAt,
      createdAt: post.createdAt,
      featured: post.featured,
      comments: post._count.comments,
    }));

    return transformedPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function NewsPage() {
  const allNews = await getPosts();
  const featuredNews = allNews.filter((article) => article.featured);
  const regularNews = allNews.filter((article) => !article.featured);

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
                  <div className="lg:w-1/2 relative h-64 lg:h-96">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 lg:p-12">
                    <Badge className="text-white mb-4"
                      style={{ backgroundColor: article.categoryColor || '#3B82F6' }}>
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
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{formatViews(article.views)}</span>
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
      <NewsGridClient initialArticles={regularNews} />
    </div>
  );
}
