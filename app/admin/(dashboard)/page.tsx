import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Users, Eye, Calendar } from 'lucide-react'

export default async function AdminDashboard() {
  // Fetch dashboard statistics
  const [
    totalPosts,
    totalComments,
    totalUsers,
    publishedPosts,
    pendingComments,
    recentPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count(),
    prisma.user.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.comment.count({ where: { status: 'PENDING' } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true, department: true, _count: { select: { comments: true } } },
    }),
  ])

  const stats = [
    {
      title: 'Total Posts',
      value: totalPosts.toString(),
      description: `${publishedPosts} published`,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Comments',
      value: totalComments.toString(),
      description: `${pendingComments} pending review`,
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      description: 'Registered users',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Published Posts',
      value: publishedPosts.toString(),
      description: 'Live articles',
      icon: Eye,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to PINTUMAS admin panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informasi Terkini
          </CardTitle>
          <CardDescription>Informasi terbaru di sistem Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post: any) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Oleh {post.author.name} di {post.department?.name}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-400">
                      {post._count.comments} komentar
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : post.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
