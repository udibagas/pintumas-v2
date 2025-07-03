'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { SettingsSchema, type Settings } from '@/lib/validations'
import { Save, AlertCircle, MapPin, Phone, Mail, Clock, Printer, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<Settings>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      contactInfo: {
        address: '',
        phone: '',
        email: '',
        workingHours: '',
        fax: '',
      },
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
      },
    },
  })

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/admin/settings')
        if (response.data.success) {
          form.reset(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Gagal memuat pengaturan')
      }
    }

    fetchSettings()
  }, [form])

  const onSubmit = async (data: Settings) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.put('/api/admin/settings', data)

      if (response.data.success) {
        toast.success('Pengaturan berhasil disimpan!')
      } else {
        setError(response.data.error || 'Terjadi kesalahan')
      }
    } catch (error: any) {
      console.error('Error saving settings:', error)
      setError(error.response?.data?.error || 'Gagal menyimpan pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Situs</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi kontak dan media sosial untuk situs web Anda
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Informasi Kontak</span>
              </CardTitle>
              <CardDescription>
                Informasi kontak yang akan ditampilkan di footer dan halaman kontak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contactInfo.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan alamat lengkap..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>Nomor Telepon</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+62 24 xxxx xxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="info@pintumas.id" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactInfo.workingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Jam Kerja</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Senin - Jumat: 08:00 - 17:00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Opsional - jam operasional kantor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Printer className="h-4 w-4" />
                        <span>Fax</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+62 24 xxxx xxxx" {...field} />
                      </FormControl>
                      <FormDescription>
                        Opsional - nomor fax
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media Sosial</CardTitle>
              <CardDescription>
                Tautan ke akun media sosial resmi yang akan ditampilkan di footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="socialMedia.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/pintumas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/pintumas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/pintumas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/pintumas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Youtube className="h-4 w-4" />
                        <span>YouTube</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/@pintumas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tiktok.com/@pintumas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
