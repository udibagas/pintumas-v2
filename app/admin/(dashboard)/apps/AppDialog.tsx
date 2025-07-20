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
import { UseCrudType } from '@/hooks/useCrud';
import Image from 'next/image';
import axios from 'axios';

const appSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  iconUrl: z.string().min(1, 'Icon is required'),
  link: z.string().url('Please enter a valid URL').min(1, 'Link is required'),
});

type AppFormData = z.infer<typeof appSchema>;

export default function AppDialog({ hook }: { hook: UseCrudType }) {
  const {
    modalOpen,
    setModalOpen,
    editingData: app,
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
  } = useForm<AppFormData>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: app?.name || '',
      iconUrl: app?.iconUrl || '',
      link: app?.link || '',
    }
  });

  useEffect(() => {
    reset({
      name: app?.name || '',
      iconUrl: app?.iconUrl || '',
      link: app?.link || '',
    });
    setPreviewImage(app?.iconUrl || '');
  }, [app, reset]);

  const isEdit = Boolean(app?.id);

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
        setValue('iconUrl', uploadedUrl);
        setPreviewImage(uploadedUrl); // Update to use the uploaded URL
        setSelectedFile(null); // Clear selected file since it's uploaded
      } catch (error) {
        console.error('Error uploading file:', error);
        // Revert preview on error
        setPreviewImage(app?.iconUrl || '');
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

  const handleFormSubmit = async (data: AppFormData) => {
    try {
      await onSubmit(data);
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
            {isEdit ? 'Edit App' : 'Create New App'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update app information' : 'Add a new application'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" id="app-form">
          {/* Hidden input for iconUrl */}
          <input type="hidden" {...register('iconUrl')} />

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="App Name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon *</Label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded object-cover border"
                />
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className={errors.iconUrl ? 'border-red-500' : ''}
                />
                {errors.iconUrl && (
                  <p className="text-sm text-red-500">{errors.iconUrl.message}</p>
                )}
                {uploading ? (
                  <p className="text-sm text-blue-600 mt-1">
                    Uploading icon...
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Upload an icon for the app (PNG, JPG, or GIF)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link *</Label>
            <Input
              id="link"
              {...register('link')}
              placeholder="https://example.com"
              className={errors.link ? 'border-red-500' : ''}
            />
            {errors.link && (
              <p className="text-sm text-red-500">{errors.link.message}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleModalClose()}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form='app-form' disabled={isSubmitting || uploading}>
            {isSubmitting ? 'Saving...' : uploading ? 'Uploading...' : 'Save App'}
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  );
}
