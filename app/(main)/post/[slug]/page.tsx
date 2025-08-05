import { ArrowLeft, Clock, Eye, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostInteractions from './PostInteractions';
import ViewCounter from '@/components/ViewCounter';
import { formatTimeAgo } from '@/lib/utils';
import { Metadata } from 'next';
import Comments from './Comments';

// Use ISR instead of force-dynamic for better performance
export const revalidate = 300; // Revalidate every 5 minutes

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  imageUrl: string | null;
  status: string;
  featured: boolean;
  allowComment?: boolean;
  views: number;
  readTime: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  departmentId: string | null;
  appId: string | null;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
  };
  department?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  app?: {
    id: string;
    name: string;
  } | null;
  tags: Array<{
    id: string;
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    status: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            name: true
          }
        },
        department: {
          select: {
            name: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return {
        title: 'Berita Tidak Ditemukan - Pintumas',
        description: 'Berita yang Anda cari tidak ditemukan.',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/post/${post.slug}`;

    // Extract text from HTML content for description
    const textContent = post.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
      .trim();

    const description = post.summary ||
      (textContent.length > 160 ? textContent.substring(0, 157) + '...' : textContent) ||
      `Baca informasi terbaru tentang "${post.department?.name || 'berita umum'}" di Pintumas.`;

    const keywords = post.tags.map(tag => tag.tag.name).join(', ');
    const sectionName = post.department?.name || 'Umum';

    return {
      title: `${post.title} - Pintumas`,
      description,
      keywords: keywords,
      authors: [{ name: post.author.name }],
      openGraph: {
        title: post.title,
        description,
        url,
        siteName: 'Pintumas',
        type: 'article',
        publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author.name],
        section: sectionName,
        tags: post.tags.map(tag => tag.tag.name),
        images: post.imageUrl ? [
          {
            url: post.imageUrl.startsWith('http') ? post.imageUrl : `${baseUrl}${post.imageUrl}`,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [
          {
            url: `${baseUrl}/images/pintumas.png`,
            width: 1200,
            height: 630,
            alt: 'Pintumas - Portal Berita',
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: post.imageUrl ? [
          post.imageUrl.startsWith('http') ? post.imageUrl : `${baseUrl}${post.imageUrl}`
        ] : [`${baseUrl}/images/pintumas.png`],
        creator: `@${post.author.name.replace(/\s+/g, '')}`,
      },
      alternates: {
        canonical: url,
      },
      other: {
        'article:author': post.author.name,
        'article:section': sectionName,
        'article:published_time': post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        'article:modified_time': post.updatedAt.toISOString(),
        'article:tag': keywords,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Berita - Pintumas',
      description: 'Portal berita terpercaya dengan informasi terkini.',
    };
  }
}

// Generate static params for all possible post slugs
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true }
    });

    return posts.map(post => ({ slug: post.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        app: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        },
        comments: {
          where: {
            status: 'APPROVED'
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    // Don't increment view count on server-side to allow static generation
    // View counting will be handled on client-side instead

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getRelatedPosts(departmentId: string | null, currentPostId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        id: { not: currentPostId },
        status: 'PUBLISHED',
        // If the current post has a department, find posts from the same department
        // If no department, find recent posts from any department
        ...(departmentId ? { departmentId } : {})
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        // Prioritize recent posts if we have a department match, otherwise just by date
        createdAt: 'desc'
      },
      take: 3
    });

    return posts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default async function SinglePost({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.departmentId, post.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Client-side view counter */}
      <ViewCounter postId={post.id} />

      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Beranda
      </Link>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Badge
            className="text-white font-semibold"
            style={{ backgroundColor: '#3B82F6' }}
          >
            {post.department?.name || 'Umum'}
          </Badge>
          {post.featured && (
            <Badge className="bg-yellow-500 text-black font-semibold">Featured</Badge>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.summary}
          </p>
        )}

        {/* Author and Meta */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={post.author.avatar || '/images/default-avatar.png'}
                alt={post.author.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatTimeAgo(post.publishedAt || post.createdAt)}</span>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{post.comments.length} komentar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.imageUrl && (
        <div className="mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="text-gray-800 leading-relaxed"
        />
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((postTag) => (
              <Badge key={postTag.id} variant="outline" className="text-sm">
                {postTag.tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      {post.author.bio && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tentang Penulis</h3>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
              <Image
                src={post.author.avatar || '/images/default-avatar.png'}
                alt={post.author.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{post.author.name}</h4>
              <p className="text-gray-600">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Post Interactions */}
      <PostInteractions
        initialLikes={0}
        initialDislikes={0}
        articleUrl={typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/post/${post.slug}`}
        articleTitle={post.title}
        articleSummary={post.summary || ''}
      />

      {/* Comments Section */}
      {post.allowComment !== false && (
        <Comments
          postId={post.id}
          initialComments={post.comments}
        />
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Berita Terkait</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/post/${relatedPost.slug}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-xs border border-gray-200 group-hover:shadow-md transition-shadow duration-200">
                  {relatedPost.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <Badge
                      className="text-white text-xs mb-2"
                      style={{ backgroundColor: '#3B82F6' }}
                    >
                      {relatedPost.department?.name || 'Umum'}
                    </Badge>
                    <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-200 line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{formatTimeAgo(relatedPost.publishedAt || relatedPost.createdAt)}</span>
                      {relatedPost.readTime && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{relatedPost.readTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
