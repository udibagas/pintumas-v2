'use client';

import { useEffect } from 'react';
import axios from 'axios';

interface ViewCounterProps {
  postId: string;
}

export default function ViewCounter({ postId }: ViewCounterProps) {
  useEffect(() => {
    // Increment view count when component mounts
    const incrementView = async () => {
      try {
        await axios.post(`/api/posts/${postId}/view`);
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };

    incrementView();
  }, [postId]);

  return null; // This component doesn't render anything
}
