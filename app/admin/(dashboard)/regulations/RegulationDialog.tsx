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
import { DepartmentData } from './types';
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

  const [departments, setDepartments] = useState<DepartmentData[]>([]);
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
      title: regulation?.title || '',
      content: regulation?.content || '',
      departmentId: regulation?.departmentId || '',
      attachmentUrl: regulation?.attachmentUrl || '',
    }
  });

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/admin/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    reset({
      title: regulation?.title || '',
      content: regulation?.content || '',
      departmentId: regulation?.departmentId || '',
      attachmentUrl: regulation?.attachmentUrl || '',
    });
  }, [regulation, reset]);

  const isEdit = Boolean(regulation?.id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (documents)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid document file (PDF, Word, or Text)');
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
            {isEdit ? 'Edit Regulation' : 'Add New Regulation'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the regulation information.' : 'Create a new regulation for your organization.'}
          </DialogDescription>
        </DialogHeader>

        <form id="regulation-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Regulation Title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              onValueChange={(value) => setValue('departmentId', value)}
              defaultValue={regulation?.departmentId || ''}
            >
              <SelectTrigger className={errors.departmentId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a department (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No department</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departmentId && (
              <p className="text-sm text-red-500">{errors.departmentId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Regulation content and details..."
              className={`min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
              rows={10}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Document Attachment</Label>
            <div className="space-y-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="text-sm text-blue-600">Uploading document...</p>
              )}
              {attachmentUrl && (
                <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">Document uploaded successfully</p>
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
              <Input
                {...register('attachmentUrl')}
                placeholder="Or paste document URL"
                className={errors.attachmentUrl ? 'border-red-500' : ''}
              />
              {errors.attachmentUrl && (
                <p className="text-sm text-red-500">{errors.attachmentUrl.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Upload a document file (PDF, Word, Text) or provide a URL to an external document.
              </p>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleModalClose()}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="regulation-form" disabled={isSubmitting || uploading}>
            {isSubmitting ? 'Saving...' : uploading ? 'Uploading...' : 'Save Regulation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
