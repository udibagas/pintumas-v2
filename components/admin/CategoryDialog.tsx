'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { generateSlug } from '@/lib/utils';
import { Category } from '@prisma/client';
import { DialogClose } from '@radix-ui/react-dialog';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').default('#3B82F6')
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  category?: Category;
  isEdit?: boolean;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CategoryDialog({ category, isOpen, handleOpenChange, onSuccess }: CategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      color: category?.color || '#3B82F6'
    }
  });

  useEffect(() => {
    reset({
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      color: category?.color || '#3B82F6'
    })
  }, [category]);

  const watchName = watch('name');
  const isEdit = Boolean(category?.id);

  // Update slug when name changes (only if not editing)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEdit) {
      setValue('slug', generateSlug(name));
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);

      const url = `/api/admin/categories${isEdit ? `/${category?.id}` : ''}`;

      const response = isEdit
        ? await axios.put(url, data)
        : await axios.post(url, data);

      if (response.data.success) {
        toast.success(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
        reset();
        onSuccess?.();
      } else {
        toast.error(response.data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Kategori' : 'Create New Kategori'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update category information' : 'Add a new content category'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="category-form">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
                handleNameChange(e);
              }}
              placeholder="Nama Kategori"
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
              placeholder="category-slug"
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
            <Label htmlFor="description">Keterangan</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Category description (optional)"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                {...register('color')}
                className="w-16 h-10 p-1 rounded border"
              />
              <Input
                {...register('color')}
                placeholder="#3B82F6"
                className={`flex-1 ${errors.color ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.color && (
              <p className="text-sm text-red-500">{errors.color.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Hex color code for the category badge
            </p>
          </div> */}
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            form='category-form'
          >
            {isSubmitting ? 'Saving...' : 'Simpan Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
