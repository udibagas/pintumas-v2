import { ArrowLeft, Clock, Eye, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import PostInteractions from './PostInteractions';

// Generate static params for all possible post slugs
export async function generateStaticParams() {
  return [
    { slug: 'revolutionary-ai-algorithm-predicts-weather-patterns' },
    { slug: 'breakthrough-gene-therapy-shows-promise' },
    { slug: 'quantum-computing-reaches-new-milestone' },
    { slug: 'sustainable-energy-storage-solution-revolutionizes-grid-systems' },
    { slug: 'machine-learning-transforms-medical-diagnosis-accuracy' },
    { slug: 'space-technology-advances-enable-mars-mission-preparations' },
    { slug: 'global-markets-surge-trade-agreements-final-negotiations' },
    { slug: 'olympic-champions-prepare-world-athletics-championships' },
    { slug: 'archaeological-discovery-reveals-ancient-civilization-secrets' },
    { slug: 'renewable-energy-initiative-powers-entire-city' },
    { slug: 'quantum-computing-breakthrough-faster-drug-discovery' },
    { slug: 'space-mission-deploys-advanced-satellite-network' },
    { slug: 'quantum-computing-breakthrough-accelerates-drug-discovery' },
    { slug: 'international-space-station-research-milestone' },
    { slug: 'sustainable-agriculture-technology-increases-crop-yields' },
    { slug: 'central-banks-digital-currency-implementation' },
    { slug: 'mental-health-initiative-schools-nationwide' },
    { slug: 'professional-esports-league-record-prize-pool' },
    { slug: 'advanced-neural-networks-transform-computer-vision' },
    { slug: 'cybersecurity-innovation-protects-critical-infrastructure' },
    { slug: 'biotechnology-advances-enable-personalized-medicine' },
    { slug: 'smart-city-technologies-improve-urban-living' },
    { slug: 'virtual-reality-applications-expand-beyond-gaming' },
    { slug: 'autonomous-vehicle-technology-reaches-new-milestones' },
    { slug: 'sustainable-agriculture-revolution-transforms-food-production' },
    { slug: 'global-climate-summit-historic-agreement-carbon-emissions' },
    { slug: 'tech-giants-report-record-q4-earnings-market-volatility' },
  ];
}

export default function SinglePost({ params }: { params: { slug: string } }) {

  // Mock article data - in real app, this would come from API/database
  const article = {
    id: 1,
    title: "Revolutionary AI Algorithm Predicts Weather Patterns with 95% Accuracy",
    content: `
      <p>Scientists at the International Weather Research Institute have developed a groundbreaking machine learning algorithm that can predict weather patterns with an unprecedented 95% accuracy rate, potentially revolutionizing meteorological forecasting and climate research worldwide.</p>
      
      <p>The new system, dubbed "WeatherNet AI," combines deep learning neural networks with traditional meteorological models to analyze vast amounts of atmospheric data from satellites, weather stations, and ocean buoys across the globe.</p>
      
      <h2>How It Works</h2>
      <p>The algorithm processes over 10 terabytes of weather data daily, identifying patterns that human meteorologists might miss. By analyzing historical weather data spanning the last 50 years, the AI has learned to recognize subtle atmospheric indicators that precede major weather events.</p>
      
      <p>"What makes this system unique is its ability to factor in micro-climate variations and long-term climate trends simultaneously," explains Dr. Emily Chen, lead researcher on the project. "Traditional models often struggle with this dual perspective."</p>
      
      <h2>Real-World Applications</h2>
      <p>The implications of this breakthrough extend far beyond daily weather forecasts. Emergency management agencies could receive earlier warnings about severe weather events, potentially saving thousands of lives and billions in property damage.</p>
      
      <p>Agricultural sectors stand to benefit enormously, with farmers able to make more informed decisions about planting, harvesting, and crop protection. The aviation industry could also see significant improvements in flight planning and safety protocols.</p>
      
      <h2>Future Developments</h2>
      <p>The research team is already working on the next iteration of WeatherNet AI, which aims to extend prediction accuracy to 30-day forecasts. They're also exploring applications in climate change modeling and extreme weather event prediction.</p>
      
      <p>The technology is expected to be integrated into major weather services within the next 18 months, marking a new era in meteorological science.</p>
    `,
    summary: "Scientists develop groundbreaking machine learning model that could transform meteorological forecasting and climate research worldwide.",
    image: "https://images.pexels.com/photos/1422286/pexels-photo-1422286.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Technology",
    author: {
      name: "Dr. Emily Chen",
      avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150",
      bio: "Senior Science Correspondent with over 15 years of experience covering breakthrough technologies and scientific discoveries."
    },
    publishedAt: "3 hours ago",
    readTime: "7 min read",
    views: "12.4K",
    comments: 45,
    tags: ["AI", "Weather", "Technology", "Science", "Climate"]
  };

  const relatedArticles = [
    {
      title: "Climate Change Accelerates Arctic Ice Melting",
      image: "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Environment",
      readTime: "5 min"
    },
    {
      title: "Machine Learning Breakthrough in Medical Diagnosis",
      image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Health",
      readTime: "6 min"
    },
    {
      title: "Quantum Computing Reaches New Milestone",
      image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Technology",
      readTime: "8 min"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      {/* Article Header */}
      <article className="mb-12">
        <div className="mb-6">
          <Badge className="bg-purple-500 text-white mb-4">
            {article.category}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Article Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">{article.publishedAt}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{article.comments}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            lineHeight: '1.8',
            fontSize: '18px'
          }}
        />

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interactive Components */}
        <PostInteractions
          initialLikes={234}
          initialDislikes={12}
          articleUrl={`${process.env.NODE_ENV === 'production' ? 'https://yoursite.com' : 'http://localhost:3000'}/post/${params.slug}`}
          articleTitle={article.title}
          articleSummary={article.summary}
        />

        {/* Author Bio */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-12">
          <div className="flex items-start space-x-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">About {article.author.name}</h3>
              <p className="text-gray-600 leading-relaxed">{article.author.bio}</p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedArticles.map((related, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src={related.image}
                alt={related.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <Badge variant="outline" className="mb-2 text-xs">
                  {related.category}
                </Badge>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {related.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{related.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}