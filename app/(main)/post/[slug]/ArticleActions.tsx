'use client';

import { useState } from 'react';
import { MessageCircle, Share2, BookmarkPlus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticleActionsProps {
  initialLikes: number;
  initialDislikes: number;
  onShare: () => void;
}

export default function ArticleActions({
  initialLikes,
  initialDislikes,
  onShare
}: ArticleActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

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

  return (
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
          onClick={onShare}
          className="text-gray-600 hover:text-gray-700"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
