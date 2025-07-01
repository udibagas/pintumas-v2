'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Tag as TagIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name must be less than 50 characters'),
})

type TagFormData = z.infer<typeof tagSchema>

interface TagFormProps {
  initialData?: Partial<TagFormData> & { id?: string; slug?: string }
  isEdit?: boolean
}

export default function TagForm({ initialData, isEdit = false }: TagFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  })

  const watchedName = watch('name')

  // Generate slug preview
  const slugPreview = watchedName
    ? watchedName
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    : ''

  const onSubmit = async (data: TagFormData) => {
    setIsLoading(true)
    try {
      const url = isEdit ? `/api/admin/tags/${initialData?.id}` : '/api/admin/tags'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/admin/tags')
        router.refresh()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to save tag')
      }
    } catch (error) {
      console.error('Error saving tag:', error)
      alert('An error occurred while saving the tag')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Tag' : 'Create New Tag'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update tag information' : 'Add a new tag to organize your content'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="h-5 w-5" />
              Tag Information
            </CardTitle>
            <CardDescription>
              Tags help organize and categorize your content for better discovery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Tag Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Technology, Health, Travel"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Slug Preview */}
            {slugPreview && (
              <div className="p-3 bg-gray-50 rounded-md">
                <Label className="text-sm font-medium text-gray-700">URL Slug Preview:</Label>
                <p className="text-sm text-gray-600 font-mono">/{slugPreview}</p>
              </div>
            )}

            {isEdit && initialData?.slug && (
              <div className="p-3 bg-blue-50 rounded-md">
                <Label className="text-sm font-medium text-blue-700">Current Slug:</Label>
                <p className="text-sm text-blue-600 font-mono">/{initialData.slug}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Tag' : 'Create Tag'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
