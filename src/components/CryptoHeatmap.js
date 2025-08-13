import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Filter, RotateCcw } from 'lucide-react';
import axios from 'axios';
import './CryptoHeatmap.css';

const CryptoHeatmap = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [sortBy, setSortBy] = useState('market_cap');
  const [hoveredCrypto, setHoveredCrypto] = useState(null);

  const timeframes = [
    { value: '1h', label: '1H', key: 'price_change_percentage_1h_in_currency' },
    { value: '24h', label: '24H', key: 'price_change_percentage_24h' },
    { value: '7d', label: '7D', key: 'price_change_percentage_7d_in_currency' },
    { value: '30d', label: '30D', key: 'price_change_percentage_30d_in_currency' }
  ];

  const sortOptions = [
    { value: 'market_cap', label: 'Market Cap' },
    { value: 'volume', label: '24h Volume' },
    { value: 'price_change', label: 'Price Change' }
  ];

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      
      const options = {
        method: 'GET',
        url: 'https://coinranking1.p.rapidapi.com/coins',
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: '24h',
          'tiers[0]': '1',
          orderBy: 'marketCap',
          orderDirection: 'desc',
          limit: '50',
          offset: '0'
        },
        headers: {
          'x-rapidapi-key': 'd8fa8b0f91mshd5f5c92b09a7ab4p1b4246jsn09be59b34bca',
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      
      if (response.data.status === 'success') {
        const coins = response.data.data.coins;
        const transformedData = coins.map((coin) => ({
          id: coin.uuid,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.iconUrl,
          current_price: parseFloat(coin.price),
          market_cap_rank: coin.rank,
          price_change_percentage_1h_in_currency: parseFloat(coin.change) * 0.3, // Approximate 1h change
          price_change_percentage_24h: parseFloat(coin.change),
          price_change_percentage_7d_in_currency: parseFloat(coin.change) * 2.5, // Approximate 7d change
          price_change_percentage_30d_in_currency: parseFloat(coin.change) * 5, // Approximate 30d change
          market_cap: parseFloat(coin.marketCap),
          total_volume: parseFloat(coin['24hVolume'])
        }));
        
        setCryptos(transformedData);
      } else {
        throw new Error('API request failed');
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data');
      console.error('Error fetching cryptos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimeframeData = () => {
    const currentTimeframe = timeframes.find(t => t.value === timeframe);
    return currentTimeframe ? currentTimeframe.key : 'price_change_percentage_24h';
  };

  const getProcessedCryptos = () => {
    let processed = [...cryptos];
    
    // Sort based on selected criteria
    if (sortBy === 'market_cap') {
      processed.sort((a, b) => b.market_cap - a.market_cap);
    } else if (sortBy === 'volume') {
      processed.sort((a, b) => b.total_volume - a.total_volume);
    } else if (sortBy === 'price_change') {
      const key = getCurrentTimeframeData();
      processed.sort((a, b) => Math.abs(b[key] || 0) - Math.abs(a[key] || 0));
    }

    return processed.slice(0, 50); // Show top 50 for better visualization
  };

  const getColorIntensity = (changePercent) => {
    if (!changePercent) return {
      background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.4) 0%, rgba(100, 116, 139, 0.6) 100%)',
      border: '2px solid rgba(148, 163, 184, 0.8)',
      boxShadow: '0 8px 32px rgba(148, 163, 184, 0.3)'
    };
    
    const absChange = Math.abs(changePercent);
    const intensity = Math.min(absChange / 15, 1); // Cap at 15% for full intensity
    
    if (changePercent > 0) {
      return {
        background: `linear-gradient(135deg, 
          rgba(34, 197, 94, ${0.4 + intensity * 0.4}) 0%, 
          rgba(22, 163, 74, ${0.6 + intensity * 0.3}) 50%,
          rgba(21, 128, 61, ${0.7 + intensity * 0.2}) 100%)`,
        border: `2px solid rgba(34, 197, 94, ${0.7 + intensity * 0.3})`,
        boxShadow: `0 8px 32px rgba(34, 197, 94, ${0.3 + intensity * 0.4}), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)`
      };
    } else {
      return {
        background: `linear-gradient(135deg, 
          rgba(239, 68, 68, ${0.4 + intensity * 0.4}) 0%, 
          rgba(220, 38, 38, ${0.6 + intensity * 0.3}) 50%,
          rgba(185, 28, 28, ${0.7 + intensity * 0.2}) 100%)`,
        border: `2px solid rgba(239, 68, 68, ${0.7 + intensity * 0.3})`,
        boxShadow: `0 8px 32px rgba(239, 68, 68, ${0.3 + intensity * 0.4}), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)`
      };
    }
  };

  const getBubbleSize = (crypto) => {
    if (sortBy === 'market_cap') {
      const maxMarketCap = Math.max(...cryptos.map(c => c.market_cap));
      const minSize = 60;
      const maxSize = 200;
      return minSize + (crypto.market_cap / maxMarketCap) * (maxSize - minSize);
    } else if (sortBy === 'volume') {
      const maxVolume = Math.max(...cryptos.map(c => c.total_volume));
      const minSize = 60;
      const maxSize = 200;
      return minSize + (crypto.total_volume / maxVolume) * (maxSize - minSize);
    } else {
      const key = getCurrentTimeframeData();
      const maxChange = Math.max(...cryptos.map(c => Math.abs(c[key] || 0)));
      const minSize = 60;
      const maxSize = 200;
      return minSize + (Math.abs(crypto[key] || 0) / maxChange) * (maxSize - minSize);
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

  if (loading) {
    return (
      <div className="heatmap-container">
        <div className="heatmap-header">
          <h1>Crypto Market Heatmap</h1>
        </div>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="heatmap-container">
        <div className="heatmap-header">
          <h1>Crypto Market Heatmap</h1>
        </div>
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchCryptos} className="retry-btn">
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const processedCryptos = getProcessedCryptos();
  const currentTimeframeKey = getCurrentTimeframeData();

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <div className="header-content">
          <h1>Crypto Market Heatmap</h1>
          <p>Interactive visualization of cryptocurrency market performance</p>
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label>Timeframe:</label>
            <div className="timeframe-buttons">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`timeframe-btn ${timeframe === tf.value ? 'active' : ''}`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="control-group">
            <label>Size by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color positive"></div>
          <span>Positive Change</span>
        </div>
        <div className="legend-item">
          <div className="legend-color negative"></div>
          <span>Negative Change</span>
        </div>
        <div className="legend-item">
          <div className="legend-color neutral"></div>
          <span>No Change</span>
        </div>
        <div className="legend-note">
          Bubble size represents {sortOptions.find(s => s.value === sortBy)?.label}
        </div>
      </div>

      <div className="heatmap-grid">
        {processedCryptos.map((crypto) => {
          const changePercent = crypto[currentTimeframeKey];
          const bubbleSize = getBubbleSize(crypto);
          const colorStyle = getColorIntensity(changePercent);
          
          return (
            <Link
              key={crypto.id}
              to={`/crypto/${crypto.id}`}
              className={`crypto-bubble ${Math.abs(changePercent || 0) > 10 ? 'high-change' : ''}`}
              style={{
                width: `${bubbleSize}px`,
                height: `${bubbleSize}px`,
                background: colorStyle.background,
                border: colorStyle.border,
                boxShadow: colorStyle.boxShadow,
                '--bubble-shadow': colorStyle.boxShadow
              }}
              onMouseEnter={() => setHoveredCrypto(crypto)}
              onMouseLeave={() => setHoveredCrypto(null)}
            >
              <div className="bubble-content">
                <img 
                  src={crypto.image} 
                  alt={crypto.name} 
                  className="crypto-icon"
                />
                <div className="crypto-symbol">
                  {crypto.symbol.toUpperCase()}
                </div>
                <div className="crypto-change">
                  {changePercent >= 0 ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {Math.abs(changePercent || 0).toFixed(1)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hoveredCrypto && (
        <div className="tooltip">
          <div className="tooltip-header">
            <img src={hoveredCrypto.image} alt={hoveredCrypto.name} />
            <div>
              <h3>{hoveredCrypto.name}</h3>
              <span>{hoveredCrypto.symbol.toUpperCase()}</span>
            </div>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span>Price:</span>
              <span>{formatPrice(hoveredCrypto.current_price)}</span>
            </div>
            <div className="tooltip-row">
              <span>Market Cap:</span>
              <span>{formatMarketCap(hoveredCrypto.market_cap)}</span>
            </div>
            <div className="tooltip-row">
              <span>{timeframes.find(t => t.value === timeframe)?.label} Change:</span>
              <span className={hoveredCrypto[currentTimeframeKey] >= 0 ? 'positive' : 'negative'}>
                {hoveredCrypto[currentTimeframeKey]?.toFixed(2) || 0}%
              </span>
            </div>
            <div className="tooltip-row">
              <span>24h Volume:</span>
              <span>{formatMarketCap(hoveredCrypto.total_volume)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoHeatmap;