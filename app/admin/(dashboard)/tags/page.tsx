import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Tag as TagIcon, Hash } from 'lucide-react'
import Link from 'next/link'
import TagsTable from '@/components/admin/TagsTable'

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: tags.length,
    used: tags.filter(tag => tag._count.posts > 0).length,
    unused: tags.filter(tag => tag._count.posts === 0).length,
    totalPosts: tags.reduce((sum, tag) => sum + tag._count.posts, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags Management</h1>
          <p className="text-gray-600">Organize your content with tags and categories</p>
        </div>
        <Link href="/admin/tags/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Tag
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tags</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TagIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Used Tags</p>
                <p className="text-2xl font-bold text-green-600">{stats.used}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Hash className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unused Tags</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unused}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TagIcon className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tagged Posts</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalPosts}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Hash className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
          <CardDescription>
            Manage content tags to help organize and categorize your posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagsTable tags={tags} />
        </CardContent>
      </Card>
    </div>
  )
}
