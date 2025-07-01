'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import Image from 'next/image'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']),
  avatar: z.string().optional(),
  bio: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  initialData?: Partial<UserFormData> & { id?: string }
  isEdit?: boolean
}

export default function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'USER',
      avatar: initialData?.avatar || '',
      bio: initialData?.bio || '',
    },
  })

  const watchedRole = watch('role')

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      const url = `/api/admin/users${isEdit ? `/${initialData?.id}` : ''}`

      // Remove password from data if it's empty in edit mode
      if (isEdit && !data.password) {
        delete data.password
      }

      const response = isEdit
        ? await axios.put(url, data)
        : await axios.post(url, data)

      if (response.status === 200 || response.status === 201) {
        router.push('/admin/users')
        router.refresh()
      } else {
        toast.error(response.data?.error || 'Failed to save user')
      }
    } catch (error: any) {
      console.error('Error saving user:', error)
      toast.error(error.response?.data?.error || 'An error occurred while saving the user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setAvatarFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload immediately
    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const avatarUrl = response.data.url
      // Update the form field with the uploaded avatar URL
      setValue('avatar', avatarUrl)
      toast.success('Avatar uploaded successfully!')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
      // Reset on error
      setAvatarFile(null)
      setAvatarPreview('')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit User' : 'Create New User'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update user information and permissions' : 'Add a new user to the system'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarPreview} alt="User avatar" />
                <AvatarFallback>
                  {watch('name')?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label>Avatar</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={isUploadingAvatar}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingAvatar ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAvatarFile(null)
                        setAvatarPreview('')
                        setValue('avatar', '')
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="password">
                Password {isEdit ? '(leave blank to keep current)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about this user..."
                rows={3}
                {...register('bio')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>Set user role and access level</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={watchedRole} onValueChange={(value) => setValue('role', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User - Basic access</SelectItem>
                  <SelectItem value="MODERATOR">Moderator - Content moderation</SelectItem>
                  <SelectItem value="ADMIN">Admin - Full access</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update User' : 'Create User'}
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
