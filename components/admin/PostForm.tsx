'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import dynamic from 'next/dynamic'

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
import Editor from 'react-simple-wysiwyg';

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
        setSuccess('Informasi berhasil dibuat!')
        router.push('/admin/posts')
      } else if (mode === 'edit' && initialData?.id) {
        await axios.put(`/api/admin/posts/${initialData.id}`, submitData)
        setSuccess('Informasi berhasil diperbarui!')
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
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'create' ? 'Buat Informasi Baru' : 'Edit Informasi'}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === 'create'
            ? 'Isi detail di bawah ini untuk membuat artikel baru.'
            : 'Perbarui detail di bawah ini untuk mengedit artikel.'
          }
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Utama</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Informasi</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan judul artikel"
                            className="text-lg"
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
                        <FormLabel>URL Slug</FormLabel>
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

                  {/* Summary */}
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ringkasan</FormLabel>
                        <FormControl>
                          <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Ringkasan singkat artikel (opsional)"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Ringkasan akan ditampilkan di daftar artikel
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Konten Informasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="min-h-[400px]">
                            <Editor
                              containerProps={{ style: { resize: 'vertical', height: '650px' } }}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Categories & Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kategorisasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Department */}
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instansi</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Instansi" />
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
                        <FormLabel>Layanan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Layanan" />
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

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag</FormLabel>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
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
                        <FormDescription className="text-xs">
                          Pilih tag yang relevan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gambar Utama</CardTitle>
                </CardHeader>
                <CardContent>
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
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="space-y-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={isUploadingImage}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploadingImage ? 'Mengunggah...' : 'Pilih Gambar'}
                          </Button>
                          <p className="text-xs text-gray-500">
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
                </CardContent>
              </Card>

              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pengaturan Publikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Featured */}
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Informasi Unggulan</FormLabel>
                          <FormDescription className="text-sm">
                            Tampilkan di beranda
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
                  <div className="space-y-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveAsDraft}
                      disabled={isLoading || isUploadingImage}
                      className="w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Menyimpan...' : 'Simpan sebagai Draf'}
                    </Button>

                    <Button
                      type="button"
                      onClick={handlePublish}
                      disabled={isLoading || isUploadingImage}
                      className="w-full"
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
                      className="w-full"
                    >
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
