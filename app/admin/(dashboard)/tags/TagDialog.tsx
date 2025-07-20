'use client';

import React, { useEffect } from 'react';
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

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
});

type TagFormData = z.infer<typeof tagSchema>;

export default function TagDialog({ hook }: { hook: UseCrudType }) {
  const {
    modalOpen,
    setModalOpen,
    editingData: tag,
    handleSubmit: onSubmit,
    isSubmitting,
    handleModalClose
  } = hook;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || '',
      slug: tag?.slug || '',
    }
  });

  useEffect(() => {
    reset({
      name: tag?.name || '',
      slug: tag?.slug || '',
    })
  }, [tag, reset]);

  const isEdit = Boolean(tag?.id);

  // Update slug when name changes (only if not editing)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEdit) {
      setValue('slug', generateSlug(name));
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => {
      setModalOpen(open);
      if (!open) {
        handleModalClose();
        reset();
      }
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Tag' : 'Create New Tag'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update tag information' : 'Add a new content tag'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="tag-form">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
                handleNameChange(e);
              }}
              placeholder="Tag Name"
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
              placeholder="tag-slug"
              className={errors.slug ? 'border-red-500' : ''}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
            <p className="text-sm text-gray-500">
              URL-friendly version of the name. Will be auto-generated from name.
            </p>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleModalClose()}>Batal</Button>
          </DialogClose>
          <Button type="submit" form='tag-form'>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}
