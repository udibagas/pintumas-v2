'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    }
  });

  useEffect(() => {
    reset({
      name: department?.name || '',
      slug: department?.slug || '',
      link: department?.link || '',
      imageUrl: department?.imageUrl || '',
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
            {isEdit ? 'Edit Department' : 'Create New Department'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update department information' : 'Add a new department'}
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
