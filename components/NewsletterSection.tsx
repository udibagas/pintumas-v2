'use client';

import { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-linear-to-br from-yellow-500 to-yellow-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-xs rounded-3xl p-8 lg:p-12">
          <div className="mb-8">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Never Miss Breaking News
            </h2>
            <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
              Get the most important stories delivered straight to your inbox. Join over 100,000 readers who trust NewsHub for their daily news digest.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/90 border-0 text-gray-900 placeholder-gray-500 focus:bg-white"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-xs">
                <CheckCircle className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Successfully Subscribed!
                </h3>
                <p className="text-yellow-100">
                  Welcome to NewsHub! Check your email for confirmation.
                </p>
              </div>
            )}

            <p className="text-sm text-yellow-100 mt-4">
              By subscribing, you agree to our privacy policy. Unsubscribe at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">100K+</div>
              <div className="text-yellow-100">Active Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">Daily</div>
              <div className="text-yellow-100">News Digest</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">24/7</div>
              <div className="text-yellow-100">Breaking Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}