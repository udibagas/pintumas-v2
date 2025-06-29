'use client';

import { useState } from 'react';
import { MessageCircle, Share2, BookmarkPlus, ThumbsUp, ThumbsDown, Facebook, Twitter, Linkedin, Instagram, Copy, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

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

interface PostInteractionsProps {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
  comments: Comment[];
  articleUrl?: string;
  articleTitle?: string;
  articleSummary?: string;
}

export default function PostInteractions({
  postId,
  initialLikes,
  initialDislikes,
  comments,
  articleUrl = typeof window !== 'undefined' ? window.location.href : '',
  articleTitle = 'Check out this article',
  articleSummary = 'An interesting article worth reading'
}: PostInteractionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [comment, setComment] = useState('');
  const [copied, setCopied] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Helper function to format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share functions
  const shareToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = `${articleTitle}\n\n${articleSummary}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the link for manual sharing
    copyToClipboard();
    alert('Link copied! You can now paste it in your Instagram story or bio.');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: articleSummary,
          url: articleUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
      if (hasDisliked) {
        setDislikes(dislikes - 1);
        setHasDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setDislikes(dislikes - 1);
      setHasDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setHasDisliked(true);
      if (hasLiked) {
        setLikes(likes - 1);
        setHasLiked(false);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment.trim(),
          postId: postId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Add the new comment to local state (it will be pending moderation)
          const newComment: Comment = {
            id: result.data.id,
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
          alert('Comment submitted successfully! It will appear after moderation.');
        }
      } else {
        alert('Failed to submit comment. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <>
      {/* Article Actions */}
      <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 my-8">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-2 ${hasLiked ? 'text-green-600' : 'text-gray-600'} hover:text-green-700`}
          >
            <ThumbsUp className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            className={`flex items-center space-x-2 ${hasDisliked ? 'text-red-600' : 'text-gray-600'} hover:text-red-700`}
          >
            <ThumbsDown className={`h-5 w-5 ${hasDisliked ? 'fill-current' : ''}`} />
            <span>{dislikes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-blue-700">
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`${isBookmarked ? 'text-yellow-600' : 'text-gray-600'} hover:text-yellow-700`}
          >
            <BookmarkPlus className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={shareViaWebAPI}
            className="text-gray-600 hover:text-gray-700"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Social Share */}
      <div className="bg-gray-50 rounded-2xl p-6 my-8">
        <h3 className="font-semibold text-gray-900 mb-4">Bagikan artikel ini</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Button
            onClick={shareToFacebook}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>
          <Button
            onClick={shareToTwitter}
            className="bg-black hover:bg-gray-800 text-white flex items-center justify-center"
          >
            <Twitter className="h-4 w-4 mr-2" />
            X (Twitter)
          </Button>
          <Button
            onClick={shareToLinkedIn}
            className="bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
          <Button
            onClick={shareToInstagram}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center"
          >
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </Button>
        </div>

        {/* Copy Link Section */}
        <div className="flex items-center space-x-2 mt-4 p-3 bg-white rounded-lg border">
          <Input
            value={articleUrl}
            readOnly
            className="flex-1 bg-gray-50 border-0 text-sm"
          />
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className={`flex items-center ${copied ? 'text-green-600 border-green-600' : ''}`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          For Instagram, copy the link and paste it in your story or bio
        </p>
      </div>

      {/* Comments Section */}
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
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
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
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="font-semibold text-sm text-gray-900 mb-1">
                      {commentItem.author.name}
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
                  <div className="flex items-center space-x-4 mt-1 px-2">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(commentItem.createdAt)}
                    </span>
                    <button className="text-xs text-gray-600 hover:text-blue-600 font-semibold">
                      Suka
                    </button>
                    <button className="text-xs text-gray-600 hover:text-blue-600 font-semibold">
                      Balas
                    </button>
                    <button className="text-xs text-gray-600 hover:text-blue-600 font-semibold">
                      Bagikan
                    </button>
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
    </>
  );
}
