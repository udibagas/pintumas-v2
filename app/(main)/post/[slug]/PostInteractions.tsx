'use client';

import ArticleActions from './ArticleActions';
import SocialShare from './SocialShare';
import Comments from './Comments';
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
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(articleUrl);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <>
      <ArticleActions
        initialLikes={initialLikes}
        initialDislikes={initialDislikes}
        onShare={shareViaWebAPI}
      />

      <SocialShare
        articleUrl={articleUrl}
        articleTitle={articleTitle}
        articleSummary={articleSummary}
      />

      <Comments
        postId={postId}
        initialComments={comments}
      />
    </>
  );
}
