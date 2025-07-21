'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['USER', 'MODERATOR', 'ADMIN'], {
    required_error: 'Please select a role',
  }),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserDialog({ hook }: { hook: UseCrudType }) {
  const {
    modalOpen,
    setModalOpen,
    editingData: user,
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
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'USER',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    }
  });

  useEffect(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'USER',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setPreviewImage(user?.avatar || '');
  }, [user, reset]);

  const isEdit = Boolean(user?.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
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

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      setUploading(true);

      let avatar = data.avatar;

      if (selectedFile) {
        avatar = await uploadFile(selectedFile);
        setValue('avatar', avatar);
      }

      // For edits, don't include password if it's empty
      const submitData = { ...data, avatar };
      if (isEdit && !data.password) {
        delete submitData.password;
      }

      await onSubmit(submitData);
      reset();
      setSelectedFile(null);
      setPreviewImage('');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setUploading(false);
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
            {isEdit ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update user information' : 'Add a new user account'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" id="user-form">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Full Name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {!isEdit && '*'}
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder={isEdit ? 'Leave empty to keep current password' : 'Enter password'}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select onValueChange={(value) => setValue('role', value as any)} defaultValue={watch('role')}>
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="User bio (optional)"
              rows={3}
              className={errors.bio ? 'border-red-500' : ''}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <Avatar className="w-16 h-16">
                  <AvatarImage src={previewImage} />
                  <AvatarFallback>
                    {watch('name')?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={errors.avatar ? 'border-red-500' : ''}
                />
                {errors.avatar && (
                  <p className="text-sm text-red-500">{errors.avatar.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Upload an avatar for the user (PNG, JPG, or GIF)
                </p>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleModalClose()}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form='user-form' disabled={isSubmitting || uploading}>
            {isSubmitting || uploading ? 'Saving...' : 'Save User'}
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  );
}
