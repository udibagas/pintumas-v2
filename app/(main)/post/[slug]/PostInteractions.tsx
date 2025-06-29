'use client';

import { useState } from 'react';
import { MessageCircle, Share2, BookmarkPlus, ThumbsUp, ThumbsDown, Facebook, Twitter, Linkedin, Instagram, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PostInteractionsProps {
  initialLikes: number;
  initialDislikes: number;
  articleUrl?: string;
  articleTitle?: string;
  articleSummary?: string;
}

export default function PostInteractions({
  initialLikes,
  initialDislikes,
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission here
    console.log('Comment submitted:', comment);
    setComment('');
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
        <h3 className="font-semibold text-gray-900 mb-4">Share this article</h3>
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
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments (127)</h3>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <img
              src={`https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100`}
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <Textarea
                placeholder="Join the discussion..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4 border-gray-300 focus:border-yellow-500"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  disabled={!comment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={`https://images.pexels.com/photos/${3785077 + i}/pexels-photo-${3785077 + i}.jpeg?auto=compress&cs=tinysrgb&w=100`}
                  alt="Commenter"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">User {i + 1}</h4>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    This is a great article! Really insightful analysis of the topic. Looking forward to more content like this.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 p-0">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      12
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 p-0">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
