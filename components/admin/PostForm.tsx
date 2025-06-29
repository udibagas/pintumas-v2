'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PostFormSchema, type PostForm } from '@/lib/validations'
import { Save, Eye, Upload } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface PostFormProps {
  categories: Category[]
  tags: Tag[]
  mode: 'create' | 'edit'
  initialData?: Partial<PostForm & { id: string }>
}

// Helper functions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default function PostForm({ categories, tags, mode, initialData }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<PostForm>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      status: initialData?.status || 'DRAFT',
      featured: initialData?.featured || false,
      categoryId: initialData?.categoryId || '',
      tagIds: initialData?.tagIds || [],
      imageUrl: initialData?.imageUrl || '',
    },
  })

  const { watch, setValue } = form

  // Auto-generate slug from title
  const watchedTitle = watch('title')
  const watchedSlug = watch('slug')

  const handleTitleChange = (title: string) => {
    if (!watchedSlug || watchedSlug === generateSlug(form.getValues('title'))) {
      setValue('slug', generateSlug(title))
    }
  }

  const onSubmit = async (data: PostForm) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const submitData = {
        ...data,
        readTime: calculateReadTime(data.content),
        publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
      }

      if (mode === 'create') {
        await axios.post('/api/admin/posts', submitData)
        setSuccess('Post created successfully!')
        router.push('/admin/posts')
      } else if (mode === 'edit' && initialData?.id) {
        await axios.put(`/api/admin/posts/${initialData.id}`, submitData)
        setSuccess('Post updated successfully!')
        router.push('/admin/posts')
      }
    } catch (err: any) {
      console.error('Error saving post:', err)
      setError(err.response?.data?.error || 'Failed to save post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAsDraft = () => {
    form.setValue('status', 'DRAFT')
    form.handleSubmit(onSubmit)()
  }

  const handlePublish = () => {
    form.setValue('status', 'PUBLISHED')
    form.handleSubmit(onSubmit)()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create New Post' : 'Edit Post'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Fill in the details below to create a new post.'
            : 'Update the details below to edit the post.'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter post title"
                        onChange={(e) => {
                          field.onChange(e)
                          handleTitleChange(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="post-slug" />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief summary of the post (optional)"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write your post content here..."
                      rows={12}
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Featured Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the URL of the featured image for this post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag.id}
                          checked={field.value?.includes(tag.id) || false}
                          onCheckedChange={(checked) => {
                            const current = field.value || []
                            if (checked) {
                              field.onChange([...current, tag.id])
                            } else {
                              field.onChange(current.filter((id) => id !== tag.id))
                            }
                          }}
                        />
                        <label
                          htmlFor={tag.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select tags that are relevant to this post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Post</FormLabel>
                    <FormDescription>
                      Mark this post as featured to highlight it on the homepage
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>

              <Button
                type="button"
                onClick={handlePublish}
                disabled={isLoading}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Publish' : 'Update & Publish'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/posts')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
