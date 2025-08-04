'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { generateSlug } from '@/lib/utils';
import { UseCrudType } from '@/hooks/useCrud';
import Image from 'next/image';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';

const departmentSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Slug cannot start or end with a hyphen'),
  link: z.string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'Please enter a valid URL'),
  imageUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, 'Please enter a valid email address'),
  address: z.string().optional(),
  facebook: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, 'Please enter a valid Facebook URL'),
  twitter: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, 'Please enter a valid Twitter URL'),
  instagram: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, 'Please enter a valid Instagram URL'),
  youtube: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, 'Please enter a valid YouTube URL'),
  linkedin: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, 'Please enter a valid LinkedIn URL'),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function DepartmentDialog({ hook }: { hook: UseCrudType }) {
  const {
    modalOpen,
    setModalOpen,
    editingData: department,
    handleSubmit: onSubmit,
    isSubmitting,
    handleModalClose
  } = hook;

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name || '',
      slug: department?.slug || '',
      link: department?.link || '',
      imageUrl: department?.imageUrl || '',
      phone: department?.phone || '',
      email: department?.email || '',
      address: department?.address || '',
      facebook: department?.facebook || '',
      twitter: department?.twitter || '',
      instagram: department?.instagram || '',
      youtube: department?.youtube || '',
      linkedin: department?.linkedin || '',
    }
  });

  useEffect(() => {
    reset({
      name: department?.name || '',
      slug: department?.slug || '',
      link: department?.link || '',
      imageUrl: department?.imageUrl || '',
      phone: department?.phone || '',
      email: department?.email || '',
      address: department?.address || '',
      facebook: department?.facebook || '',
      twitter: department?.twitter || '',
      instagram: department?.instagram || '',
      youtube: department?.youtube || '',
      linkedin: department?.linkedin || '',
    });
    setPreviewImage(department?.imageUrl || '');
  }, [department, reset]);

  const isEdit = Boolean(department?.id);

  // Update slug when name changes (only if not editing)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEdit) {
      setValue('slug', generateSlug(name));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Upload file immediately
      try {
        setUploading(true);
        const uploadedUrl = await uploadFile(file);
        setValue('imageUrl', uploadedUrl);
        setPreviewImage(uploadedUrl); // Update to use the uploaded URL
        setSelectedFile(null); // Clear selected file since it's uploaded
      } catch (error) {
        console.error('Error uploading file:', error);
        // Revert preview on error
        setPreviewImage(department?.imageUrl || '');
        setSelectedFile(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.url;
  };

  const handleFormSubmit = async (data: DepartmentFormData) => {
    try {
      await onSubmit(data);
      reset();
      setSelectedFile(null);
      setPreviewImage('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => {
      setModalOpen(open);
      if (!open) {
        handleModalClose();
        reset();
        setSelectedFile(null);
        setPreviewImage('');
      }
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Instansi' : 'Tambah Instansi Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update informasi instansi' : 'Tambah instansi baru'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" id="department-form">
          {/* Hidden input for imageUrl */}
          <input type="hidden" {...register('imageUrl')} />

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
                handleNameChange(e);
              }}
              placeholder="Department Name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="department-slug"
              className={errors.slug ? 'border-red-500' : ''}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
            <p className="text-sm text-gray-500">
              URL-friendly version of the name. Will be auto-generated from name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">External Link</Label>
            <Input
              id="link"
              {...register('link')}
              placeholder="https://example.com (optional)"
              className={errors.link ? 'border-red-500' : ''}
            />
            {errors.link && (
              <p className="text-sm text-red-500">{errors.link.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border"
                />
              )}
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className={errors.imageUrl ? 'border-red-500' : ''}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                )}
                {uploading ? (
                  <p className="text-sm text-blue-600 mt-1">
                    Uploading logo...
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a logo for the department (PNG, JPG, or GIF)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4 mr-1 text-gray-500" /> Phone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Phone number (optional)"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4 mr-1 text-gray-500" /> Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Email address (optional)"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="w-4 h-4 mr-1 text-gray-500" /> Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Office address (optional)"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Social Media</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2"><Facebook className="w-4 h-4 mr-1 text-blue-600" /> Facebook</Label>
                <Input
                  id="facebook"
                  {...register('facebook')}
                  placeholder="https://facebook.com/department (optional)"
                  className={errors.facebook ? 'border-red-500' : ''}
                />
                {errors.facebook && (
                  <p className="text-sm text-red-500">{errors.facebook.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2"><Twitter className="w-4 h-4 mr-1 text-sky-500" /> Twitter</Label>
                <Input
                  id="twitter"
                  {...register('twitter')}
                  placeholder="https://twitter.com/department (optional)"
                  className={errors.twitter ? 'border-red-500' : ''}
                />
                {errors.twitter && (
                  <p className="text-sm text-red-500">{errors.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2"><Instagram className="w-4 h-4 mr-1 text-pink-500" /> Instagram</Label>
                <Input
                  id="instagram"
                  {...register('instagram')}
                  placeholder="https://instagram.com/department (optional)"
                  className={errors.instagram ? 'border-red-500' : ''}
                />
                {errors.instagram && (
                  <p className="text-sm text-red-500">{errors.instagram.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2"><Youtube className="w-4 h-4 mr-1 text-red-600" /> YouTube</Label>
                <Input
                  id="youtube"
                  {...register('youtube')}
                  placeholder="https://youtube.com/department (optional)"
                  className={errors.youtube ? 'border-red-500' : ''}
                />
                {errors.youtube && (
                  <p className="text-sm text-red-500">{errors.youtube.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2"><Linkedin className="w-4 h-4 mr-1 text-blue-700" /> LinkedIn</Label>
                <Input
                  id="linkedin"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/company/department (optional)"
                  className={errors.linkedin ? 'border-red-500' : ''}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-500">{errors.linkedin.message}</p>
                )}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleModalClose()}>Batal</Button>
          </DialogClose>
          <Button type="submit" form='department-form' disabled={isSubmitting || uploading}>
            {isSubmitting ? 'Menyimpan...' : uploading ? 'Mengupload...' : 'Simpan Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
