import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Using a mock news data since most news APIs require API keys
      // In a real app, you would use a service like NewsAPI, CoinDesk API, etc.
      const mockNews = [
        {
          id: 1,
          title: "Bitcoin Reaches New All-Time High as Institutional Adoption Grows",
          description: "Major corporations continue to add Bitcoin to their treasury reserves, driving unprecedented demand and price appreciation.",
          url: "https://www.coindesk.com/markets/2024/01/15/bitcoin-reaches-new-all-time-high/",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: "CryptoNews",
          urlToImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop"
        },
        {
          id: 2,
          title: "Ethereum 2.0 Staking Rewards Attract More Validators",
          description: "The Ethereum network sees increased participation in staking as validators earn attractive rewards while securing the network.",
          url: "https://ethereum.org/en/staking/",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: "BlockchainDaily",
          urlToImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop"
        },
        {
          id: 3,
          title: "DeFi Protocol Launches Revolutionary Yield Farming Strategy",
          description: "New decentralized finance protocol introduces innovative mechanisms for maximizing yield while minimizing impermanent loss.",
          url: "https://defipulse.com/blog/yield-farming-guide/",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: "DeFi Times",
          urlToImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop"
        },
        {
          id: 4,
          title: "Central Bank Digital Currencies Gain Momentum Worldwide",
          description: "Multiple countries accelerate their CBDC development programs as digital payments become increasingly mainstream.",
          url: "https://www.bis.org/publ/othp42.htm",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: "Financial Tribune",
          urlToImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop"
        },
        {
          id: 5,
          title: "NFT Market Shows Signs of Recovery After Recent Downturn",
          description: "Trading volumes and floor prices for popular NFT collections begin to stabilize as market sentiment improves.",
          url: "https://opensea.io/blog/articles/nft-market-trends",
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          source: "NFT Insider",
          urlToImage: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=200&fit=crop"
        },
        {
          id: 6,
          title: "Regulatory Clarity Boosts Cryptocurrency Adoption in Europe",
          description: "New EU regulations provide clear framework for cryptocurrency operations, encouraging institutional investment.",
          url: "https://www.europarl.europa.eu/news/en/press-room/20230414IPR80133/crypto-assets-green-light-to-new-rules-for-tracing-transfers-in-the-eu",
          publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          source: "Euro Crypto",
          urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop"
        }
      ];
      
      setNews(mockNews);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchNews} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>Cryptocurrency News</h1>
        <p>Stay updated with the latest developments in the crypto world</p>
      </div>

      <div className="news-grid">
        {news.map((article) => (
          <article key={article.id} className="news-card">
            <div className="news-image">
              <img src={article.urlToImage} alt={article.title} />
            </div>
            
            <div className="news-content">
              <div className="news-meta">
                <span className="news-source">{article.source}</span>
                <div className="news-date">
                  <Clock size={14} />
                  {formatDate(article.publishedAt)}
                </div>
              </div>
              
              <h2 className="news-title">{article.title}</h2>
              <p className="news-description">{article.description}</p>
              
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="read-more"
              >
                Read More
                <ExternalLink size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default News;