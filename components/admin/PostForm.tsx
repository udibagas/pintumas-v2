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
import { Save, Eye, Upload, X } from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import Image from 'next/image'
import { toast } from 'sonner'

interface Department {
  id: string
  name: string
  slug: string
}

interface App {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface PostFormProps {
  departments: Department[]
  apps: App[]
  tags: Tag[]
  mode: 'create' | 'edit'
  initialData?: Partial<PostForm & { id: string }>
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default function PostForm({ departments, apps, tags, mode, initialData }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const form = useForm<PostForm>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      status: initialData?.status || 'DRAFT',
      featured: initialData?.featured || false,
      departmentId: initialData?.departmentId || '',
      appId: initialData?.appId || '',
      tagIds: initialData?.tagIds || [],
      imageUrl: initialData?.imageUrl || '',
    },
  })

  const { setValue } = form

  const handleTitleChange = (title: string) => {
    setValue('slug', generateSlug(title))
  }

  // Handle image file selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Harap pilih file gambar')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar harus kurang dari 5MB')
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload immediately
    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await axios.post('/api/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const imageUrl = data.url
      // Update the form field with the uploaded image URL
      setValue('imageUrl', imageUrl)
      toast.success('Gambar berhasil diunggah!')

      console.log('Image uploaded successfully:', imageUrl)

      // Clear the input
      e.target.value = ''
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Gagal mengunggah gambar')
      // Reset on error
      setImageFile(null)
      setImagePreview('')
      setValue('imageUrl', '')
      e.target.value = ''
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Remove selected image
  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setValue('imageUrl', '')
  }

  const onSubmit = async (data: PostForm) => {
    console.log('Submitting post data:', data)
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
        setSuccess('Artikel berhasil dibuat!')
        router.push('/admin/posts')
      } else if (mode === 'edit' && initialData?.id) {
        await axios.put(`/api/admin/posts/${initialData.id}`, submitData)
        setSuccess('Artikel berhasil diperbarui!')
        router.push('/admin/posts')
      }
    } catch (err: any) {
      console.error('Error saving post:', err)
      setError(err.response?.data?.error || 'Gagal menyimpan artikel')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAsDraft = async () => {
    console.log('Save as draft clicked')
    setError(null)
    setSuccess(null)

    // Get current form values and override status
    const currentValues = form.getValues()
    const draftData = { ...currentValues, status: 'DRAFT' as const }

    console.log('Draft data:', draftData)
    await onSubmit(draftData)
  }

  const handlePublish = async () => {
    console.log('Publish clicked')
    setError(null)
    setSuccess(null)

    // Get current form values and override status
    const currentValues = form.getValues()
    const publishData = { ...currentValues, status: 'PUBLISHED' as const }

    console.log('Publish data:', publishData)
    await onSubmit(publishData)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Buat Artikel Baru' : 'Edit Artikel'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Isi detail di bawah ini untuk membuat artikel baru.'
            : 'Perbarui detail di bawah ini untuk mengedit artikel.'
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
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan judul artikel"
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
                      <Input {...field} placeholder="slug-artikel" />
                    </FormControl>
                    <FormDescription>
                      Versi URL yang ramah dari judul
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
                  <FormLabel>Ringkasan</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ringkasan singkat artikel (opsional)"
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
                  <FormLabel>Konten</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tulis konten artikel Anda di sini..."
                      rows={12}
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* App */}
              <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select app" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {apps.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draf</SelectItem>
                        <SelectItem value="PUBLISHED">Diterbitkan</SelectItem>
                        <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Featured Image Upload */}
            <div className="space-y-4">
              <div>
                <FormLabel>Gambar Utama</FormLabel>
                <FormDescription>
                  Unggah gambar untuk artikel ini (maks 5MB)
                </FormDescription>
              </div>

              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Pratinjau gambar utama"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={isUploadingImage}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingImage ? 'Mengunggah...' : 'Pilih Gambar'}
                      </Button>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF hingga 5MB
                      </p>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
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
                    Pilih tag yang relevan dengan artikel ini
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
                    <FormLabel className="text-base">Artikel Unggulan</FormLabel>
                    <FormDescription>
                      Tandai artikel ini sebagai unggulan untuk ditampilkan di beranda
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
                disabled={isLoading || isUploadingImage}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Menyimpan...' : 'Simpan sebagai Draf'}
              </Button>

              <Button
                type="button"
                onClick={handlePublish}
                disabled={isLoading || isUploadingImage}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isLoading
                  ? 'Menerbitkan...'
                  : mode === 'create'
                    ? 'Terbitkan'
                    : 'Perbarui & Terbitkan'
                }
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/posts')}
                disabled={isLoading || isUploadingImage}
              >
                Batal
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
