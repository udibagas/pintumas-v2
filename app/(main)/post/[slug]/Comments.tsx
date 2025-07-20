'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import axios from 'axios';
import { formatTimeAgo } from '@/lib/utils';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  status: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface CommentsProps {
  postId: string;
  initialComments: Comment[];
}

export default function Comments({ postId, initialComments }: CommentsProps) {
  const [comment, setComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(initialComments);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      const response = await axios.post('/api/comments', {
        content: comment.trim(),
        postId: postId,
      });

      if (response.data.success) {
        // Add the new comment to local state (it will be pending moderation)
        const newComment: Comment = {
          id: response.data.data.id,
          content: comment.trim(),
          status: 'PENDING',
          createdAt: new Date(),
          author: {
            id: 'current-user',
            name: 'You',
            avatar: null
          }
        };
        setLocalComments(prev => [newComment, ...prev]);
        setComment('');

        // Show success message
        toast.success('Comment submitted successfully! It will appear after moderation.');
      } else {
        toast.error('Failed to submit comment. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit comment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <section className="my-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Komentar ({localComments.length})</h3>

      {/* Comment Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3">
          <Image
            src="/images/default-avatar.png"
            alt="Your avatar"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <Input
              placeholder="Tulis komentar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-sm"
            />
            {comment.trim() && (
              <div className="mt-2">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-black hover:bg-gray-900 text-white font-medium px-4 rounded-md"
                  disabled={isSubmittingComment}
                >
                  <Send />
                  {isSubmittingComment ? 'Mengirim...' : 'Kirim'}
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {localComments.length > 0 ? (
          localComments.map((commentItem) => (
            <div key={commentItem.id} className="flex items-start space-x-3">
              <Image
                src={commentItem.author.avatar || '/images/default-avatar.png'}
                alt={commentItem.author.name}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {commentItem.author.name}
                    <span className="ml-2 text-xs text-gray-500">
                      {formatTimeAgo(commentItem.createdAt)}
                    </span>
                    {commentItem.status === 'PENDING' && (
                      <span className="ml-2 text-xs text-yellow-600 font-normal">
                        • Menunggu persetujuan
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {commentItem.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Belum ada komentar</p>
            <p className="text-gray-400 text-sm">Jadilah yang pertama memberikan komentar</p>
          </div>
        )}
      </div>
    </section>
  );
}
