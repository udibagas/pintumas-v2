'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AnnouncementPostSchema, type AnnouncementPost } from '@/lib/validations'
import { Save, AlertCircle, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

interface AnnouncementFormProps {
  initialData?: Partial<AnnouncementPost & { id: string }>
  isEditing?: boolean
}

const announcementTypes = [
  { value: 'INFO', label: 'Informasi', description: 'Informasi umum' },
  { value: 'BREAKING', label: 'Berita Terbaru', description: 'Berita penting dan terbaru' },
  { value: 'ALERT', label: 'Peringatan', description: 'Peringatan penting atau bahaya' },
  { value: 'EVENT', label: 'Acara', description: 'Pengumuman acara' },
  { value: 'MAINTENANCE', label: 'Pemeliharaan', description: 'Pemberitahuan pemeliharaan sistem' },
]

const priorities = [
  { value: 1, label: 'Rendah', color: 'text-green-600' },
  { value: 2, label: 'Sedang', color: 'text-yellow-600' },
  { value: 3, label: 'Tinggi', color: 'text-orange-600' },
  { value: 4, label: 'Mendesak', color: 'text-red-600' },
]

export default function AnnouncementForm({ initialData, isEditing = false }: AnnouncementFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  const form = useForm<AnnouncementPost>({
    resolver: zodResolver(AnnouncementPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      announcementType: initialData?.announcementType || 'INFO',
      priority: initialData?.priority || 1,
      status: initialData?.status || 'PUBLISHED',
      startDate: initialData?.startDate ?
        new Date(initialData.startDate).toISOString().slice(0, 16) : '',
      endDate: initialData?.endDate ?
        new Date(initialData.endDate).toISOString().slice(0, 16) : '',
      linkUrl: initialData?.linkUrl || '',
      linkText: initialData?.linkText || '',
      categoryId: initialData?.categoryId || '',
    },
  })

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/admin/categories')
        if (response.data.success) {
          setCategories(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Gagal memuat kategori')
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (data: AnnouncementPost) => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        ...data,
        // Convert date strings to proper format if provided
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        // Clean up empty strings
        linkUrl: data.linkUrl || null,
        linkText: data.linkText || null,
        summary: data.summary || null,
        categoryId: data.categoryId || null, // Allow null category
      }

      let response
      if (isEditing && initialData?.id) {
        response = await axios.put(`/api/admin/announcements/${initialData.id}`, payload)
      } else {
        response = await axios.post('/api/admin/announcements', payload)
      }

      if (response.data.success) {
        toast.success(isEditing ? 'Pengumuman berhasil diperbarui!' : 'Pengumuman berhasil dibuat!')
        router.push('/admin/announcements')
        router.refresh()
      } else {
        setError(response.data.error || 'Terjadi kesalahan')
      }
    } catch (error: any) {
      console.error('Error saving announcement:', error)
      setError(error.response?.data?.error || 'Gagal menyimpan pengumuman')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/announcements')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Masukkan detail utama untuk pengumuman Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul pengumuman..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ringkasan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ringkasan singkat pengumuman..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ringkasan opsional yang akan ditampilkan dalam daftar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konten</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis konten pengumuman Anda di sini..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Konten utama pengumuman Anda
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Announcement Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pengumuman</CardTitle>
              <CardDescription>
                Konfigurasikan bagaimana pengumuman Anda akan ditampilkan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="announcementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis pengumuman" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {announcementTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioritas</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih prioritas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value.toString()}>
                              <span className={priority.color}>{priority.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draf</SelectItem>
                          <SelectItem value="PUBLISHED">Terbit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Links */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal & Tautan</CardTitle>
              <CardDescription>
                Atur kapan pengumuman harus ditampilkan dan tambahkan tautan opsional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="datetime-local"
                            value={field.value || ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                          <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Kapan mulai menampilkan pengumuman ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Berakhir</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="datetime-local"
                            value={field.value || ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                          <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Kapan berhenti menampilkan pengumuman ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Tautan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tautan eksternal opsional untuk pengumuman ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teks Tautan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Baca selengkapnya"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Teks yang ditampilkan untuk tautan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Menyimpan...' : isEditing ? 'Perbarui Pengumuman' : 'Buat Pengumuman'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
