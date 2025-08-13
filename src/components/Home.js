import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight, BarChart3, Globe, Shield } from 'lucide-react';
import axios from 'axios';
import './Home.css';

// Helper functions for coin data
const getCoinName = (symbol) => {
  const coinNames = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'BNB',
    'XRP': 'XRP',
    'ADA': 'Cardano',
    'SOL': 'Solana',
    'DOGE': 'Dogecoin',
    'DOT': 'Polkadot',
    'AVAX': 'Avalanche',
    'MATIC': 'Polygon'
  };
  return coinNames[symbol] || symbol;
};

const getCoinImage = (symbol) => {
  const coinImages = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    'BNB': 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    'ADA': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    'SOL': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    'DOGE': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    'DOT': 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    'AVAX': 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    'MATIC': 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png'
  };
  return coinImages[symbol] || 'https://via.placeholder.com/32';
};

const Home = () => {
  const [topCryptos, setTopCryptos] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch top 10 cryptocurrencies using Coinranking API
      const options = {
        method: 'GET',
        url: 'https://coinranking1.p.rapidapi.com/coins',
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: '24h',
          'tiers[0]': '1',
          orderBy: 'marketCap',
          orderDirection: 'desc',
          limit: '10',
          offset: '0'
        },
        headers: {
          'x-rapidapi-key': 'd8fa8b0f91mshd5f5c92b09a7ab4p1b4246jsn09be59b34bca',
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const cryptoResponse = await axios.request(options);
      
      if (cryptoResponse.data.status === 'success') {
        const coins = cryptoResponse.data.data.coins;
        const transformedData = coins.map((coin) => ({
          id: coin.uuid,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.iconUrl,
          current_price: parseFloat(coin.price),
          market_cap_rank: coin.rank,
          price_change_percentage_24h: parseFloat(coin.change),
          market_cap: parseFloat(coin.marketCap)
        }));
        
        setTopCryptos(transformedData);
      }

      // Mock news data (first 3 articles)
      const mockNews = [
        {
          id: 1,
          title: "Bitcoin Reaches New All-Time High as Institutional Adoption Grows",
          description: "Major corporations continue to add Bitcoin to their treasury reserves, driving unprecedented demand.",
          url: "https://www.coindesk.com/markets/2024/01/15/bitcoin-reaches-new-all-time-high/",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: "CryptoNews",
          urlToImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop"
        },
        {
          id: 2,
          title: "Ethereum 2.0 Staking Rewards Attract More Validators",
          description: "The Ethereum network sees increased participation in staking as validators earn attractive rewards.",
          url: "https://ethereum.org/en/staking/",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: "BlockchainDaily",
          urlToImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop"
        },
        {
          id: 3,
          title: "DeFi Protocol Launches Revolutionary Yield Farming Strategy",
          description: "New decentralized finance protocol introduces innovative mechanisms for maximizing yield.",
          url: "https://defipulse.com/blog/yield-farming-guide/",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: "DeFi Times",
          urlToImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop"
        }
      ];
      
      setNews(mockNews);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Track Cryptocurrency
            <span className="hero-highlight"> Markets</span>
          </h1>
          <p className="hero-description">
            Stay updated with real-time cryptocurrency prices, market trends, and the latest news 
            from the world of digital assets. Make informed investment decisions with our comprehensive platform.
          </p>
          <div className="hero-buttons">
            <Link to="/markets" className="btn-primary">
              Explore Markets
              <ArrowRight size={20} />
            </Link>
            <Link to="/news" className="btn-secondary">
              Read News
            </Link>
          </div>
        </div>
        
        <div className="hero-features">
          <div className="feature-card">
            <BarChart3 size={24} />
            <h3>Real-time Data</h3>
            <p>Live cryptocurrency prices and market data</p>
          </div>
          <div className="feature-card">
            <Globe size={24} />
            <h3>Global Markets</h3>
            <p>Track cryptocurrencies from around the world</p>
          </div>
          <div className="feature-card">
            <Shield size={24} />
            <h3>Secure & Reliable</h3>
            <p>Trusted data sources and secure platform</p>
          </div>
        </div>
      </section>

      {/* Top Cryptocurrencies Section */}
      <section className="top-cryptos-section">
        <div className="section-header">
          <h2>Top Cryptocurrencies</h2>
          <Link to="/markets" className="view-all-link">
            View All Markets
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={fetchData} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : (
          <div className="crypto-grid">
            {topCryptos.map((crypto) => (
              <Link
                key={crypto.id}
                to={`/crypto/${crypto.id}`}
                className="crypto-card"
              >
                <div className="crypto-card-header">
                  <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
                  <div className="crypto-info">
                    <h3 className="crypto-name">{crypto.name}</h3>
                    <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
                  </div>
                  <span className="crypto-rank">#{crypto.market_cap_rank}</span>
                </div>
                
                <div className="crypto-price">{formatPrice(crypto.current_price)}</div>
                
                <div className={`crypto-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
                
                <div className="crypto-market-cap">
                  <span className="label">Market Cap</span>
                  <span className="value">{formatMarketCap(crypto.market_cap)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest News Section */}
      <section className="news-section">
        <div className="section-header">
          <h2>Latest Crypto News</h2>
          <Link to="/news" className="view-all-link">
            View All News
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="news-preview-grid">
          {news.map((article) => (
            <a 
              key={article.id} 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-preview-card"
            >
              <div className="news-image">
                <img src={article.urlToImage} alt={article.title} />
                <div className="news-source">{article.source}</div>
              </div>
              
              <div className="news-content">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-description">{article.description}</p>
                <div className="news-date">{formatDate(article.publishedAt)}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;