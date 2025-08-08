'use client';

import SocialShare from './SocialShare';

interface PostInteractionsProps {
  articleUrl?: string;
  articleTitle?: string;
  articleSummary?: string;
}

export default function PostInteractions({
  articleUrl = typeof window !== 'undefined' ? window.location.href : '',
  articleTitle = 'Check out this article',
  articleSummary = 'An interesting article worth reading'
}: PostInteractionsProps) {

  return (
    <>
      <SocialShare
        articleUrl={articleUrl}
        articleTitle={articleTitle}
        articleSummary={articleSummary}
      />
    </>
  );
}
