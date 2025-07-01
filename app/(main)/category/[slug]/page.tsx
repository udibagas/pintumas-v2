import { ArrowLeft, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import CategoryPageClient from './CategoryPageClient';
import Image from 'next/image';
import { formatTimeAgo, formatViews } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  author: string;
  publishedAt: string | Date;
  readTime: string;
  views: number;
  comments: number;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount: number;
}

interface CategoryData {
  category: Category;
  posts: Post[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

async function getCategoryData(slug: string): Promise<CategoryData | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          where: {
            status: 'PUBLISHED',
            isAnnouncement: false // Exclude announcements from regular posts
          },
          take: 12,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            _count: {
              select: {
                comments: {
                  where: { status: 'APPROVED' }
                }
              }
            }
          }
        },
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
                isAnnouncement: false
              }
            }
          }
        }
      }
    });

    if (!category) return null;

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color || '#3B82F6',
        articleCount: category._count.posts
      },
      posts: category.posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary || '',
        image: post.imageUrl || '/images/default-post.jpg',
        author: post.author.name,
        publishedAt: post.publishedAt || post.createdAt,
        readTime: post.readTime || '5 min read',
        views: post.views,
        comments: post._count.comments,
        featured: post.featured
      })),
      pagination: {
        total: category._count.posts,
        limit: 12,
        offset: 0,
        hasMore: category._count.posts > 12
      }
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryData = await getCategoryData(params.slug);

  if (!categoryData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link href="/">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { category, posts } = categoryData;
  const featuredArticle = posts.find(post => post.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      {/* Category Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: category.color || '#3B82F6' }}>
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
            <h2 className="text-2xl font-bold text-gray-900">Editor&apos;s Pick</h2>
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
                    <span>{formatTimeAgo(featuredArticle.publishedAt)}</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{formatViews(featuredArticle.views)}</span>
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
      <CategoryPageClient initialPosts={posts} categorySlug={params.slug} />

    </div>
  );
}