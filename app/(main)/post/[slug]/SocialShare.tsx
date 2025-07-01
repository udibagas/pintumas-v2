'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SocialShareProps {
  articleUrl?: string;
  articleTitle?: string;
  articleSummary?: string;
}

export default function SocialShare({
  articleUrl = typeof window !== 'undefined' ? window.location.href : '',
  articleTitle = 'Check out this article',
  articleSummary = 'An interesting article worth reading'
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

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
    toast.success('Link copied! You can now paste it in your Instagram story or bio.');
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

  return (
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
  );
}
