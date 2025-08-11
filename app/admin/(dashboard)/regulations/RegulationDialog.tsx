'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseCrudType } from '@/hooks/useCrud';
import { RegulationFormSchema, type RegulationForm } from '@/lib/validations';
import axios from 'axios';

export default function RegulationDialog({ hook }: { hook: UseCrudType }) {
  const {
    modalOpen,
    setModalOpen,
    editingData: regulation,
    handleSubmit: onSubmit,
    isSubmitting,
    handleModalClose
  } = hook;

  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegulationForm>({
    resolver: zodResolver(RegulationFormSchema),
    defaultValues: {
      number: regulation?.number || '',
      title: regulation?.title || '',
      description: regulation?.description || '',
      effectiveDate: regulation?.effectiveDate ? new Date(regulation.effectiveDate).toISOString().split('T')[0] : '',
      status: regulation?.status || 'DRAFT',
      attachmentUrl: regulation?.attachmentUrl || '',
    }
  });

  useEffect(() => {
    reset({
      number: regulation?.number || '',
      title: regulation?.title || '',
      description: regulation?.description || '',
      effectiveDate: regulation?.effectiveDate ? new Date(regulation.effectiveDate).toISOString().split('T')[0] : '',
      status: regulation?.status || 'DRAFT',
      attachmentUrl: regulation?.attachmentUrl || '',
    });
  }, [regulation, reset]);

  const isEdit = Boolean(regulation?.id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (documents)
    const allowedTypes = ['application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid document file (PDF)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setValue('attachmentUrl', response.data.url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (data: RegulationForm) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const attachmentUrl = watch('attachmentUrl');

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => {
      setModalOpen(open);
      if (!open) {
        handleModalClose();
        reset();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Peraturan' : 'Tambah Peraturan Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Perbarui informasi peraturan.' : 'Buat peraturan baru untuk organisasi Anda.'}
          </DialogDescription>
        </DialogHeader>

        <form id="regulation-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="number">Nomor Peraturan *</Label>
            <Input
              id="number"
              {...register('number')}
              placeholder="Nomor Peraturan (e.g., 001/2024)"
              className={errors.number ? 'border-red-500' : ''}
            />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Peraturan *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Judul Peraturan"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Deskripsi dan detail peraturan..."
              className={`min-h-[150px] ${errors.description ? 'border-red-500' : ''}`}
              rows={6}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Tanggal Berlaku</Label>
            <Input
              id="effectiveDate"
              type="date"
              {...register('effectiveDate')}
              className={errors.effectiveDate ? 'border-red-500' : ''}
            />
            {errors.effectiveDate && (
              <p className="text-sm text-red-500">{errors.effectiveDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              onValueChange={(value) => setValue('status', value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
              defaultValue={regulation?.status || 'DRAFT'}
            >
              <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Dipublikasikan</SelectItem>
                <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Dokumen Lampiran</Label>
            <div className="space-y-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="text-sm text-blue-600">Mengunggah dokumen...</p>
              )}
              {attachmentUrl && (
                <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">Dokumen berhasil diunggah</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(attachmentUrl, '_blank')}
                  >
                    View
                  </Button>
                </div>
              )}
              {errors.attachmentUrl && (
                <p className="text-sm text-red-500">{errors.attachmentUrl.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Unggah file dokumen (PDF, Word, Teks) atau berikan URL ke dokumen eksternal.
              </p>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleModalClose()}>Batal</Button>
          </DialogClose>
          <Button type="submit" form="regulation-form" disabled={isSubmitting || uploading}>
            {isSubmitting ? 'Menyimpan...' : uploading ? 'Mengunggah...' : 'Simpan Peraturan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
