import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Globe, ExternalLink } from 'lucide-react';
import axios from 'axios';
import PriceChart from './PriceChart';
import './CryptoDetail.css';

// Helper functions for coin data
const getCoinName = (symbol) => {
  const coinNames = {
    'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'BNB': 'BNB', 'XRP': 'XRP', 'ADA': 'Cardano',
    'SOL': 'Solana', 'DOGE': 'Dogecoin', 'DOT': 'Polkadot', 'AVAX': 'Avalanche', 'MATIC': 'Polygon',
    'SHIB': 'Shiba Inu', 'LTC': 'Litecoin', 'TRX': 'TRON', 'UNI': 'Uniswap', 'LINK': 'Chainlink'
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
  return coinImages[symbol] || 'https://via.placeholder.com/64';
};

const getCoinDescription = (symbol) => {
  const descriptions = {
    'BTC': 'Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.',
    'ETH': 'Ethereum is a decentralized platform that runs smart contracts and decentralized applications.',
    'BNB': 'BNB is the native cryptocurrency of the Binance exchange and Binance Smart Chain.',
    'XRP': 'XRP is a digital payment protocol and cryptocurrency designed for fast, low-cost international transfers.',
    'ADA': 'Cardano is a blockchain platform built on peer-reviewed research and evidence-based methods.'
  };
  return descriptions[symbol] || `${getCoinName(symbol)} is a cryptocurrency available on various exchanges.`;
};

const CryptoDetail = () => {
  const { id } = useParams();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCryptoDetail = useCallback(async () => {
    try {
      setLoading(true);
      
      const options = {
        method: 'GET',
        url: `https://coinranking1.p.rapidapi.com/coin/${id}`,
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: '24h'
        },
        headers: {
          'x-rapidapi-key': 'd8fa8b0f91mshd5f5c92b09a7ab4p1b4246jsn09be59b34bca',
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      
      if (response.data.status === 'success') {
        const coin = response.data.data.coin;
        
        // Transform Coinranking data to match our component structure
        const transformedCrypto = {
          id: coin.uuid,
          symbol: coin.symbol,
          name: coin.name,
          image: {
            large: coin.iconUrl
          },
          market_data: {
            current_price: {
              usd: parseFloat(coin.price)
            },
            price_change_percentage_24h: parseFloat(coin.change),
            market_cap: {
              usd: parseFloat(coin.marketCap)
            },
            total_volume: {
              usd: parseFloat(coin['24hVolume'])
            },
            circulating_supply: parseFloat(coin.supply?.circulating) || null,
            total_supply: parseFloat(coin.supply?.total) || null,
            ath: {
              usd: parseFloat(coin.allTimeHigh?.price) || parseFloat(coin.price) * 1.5
            },
            atl: {
              usd: parseFloat(coin.price) * 0.1 // Mock ATL since not provided
            }
          },
          description: {
            en: coin.description || getCoinDescription(coin.symbol)
          },
          links: {
            homepage: coin.websiteUrl ? [coin.websiteUrl] : ['#']
          }
        };
        
        setCrypto(transformedCrypto);
      } else {
        throw new Error('Cryptocurrency not found');
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency details');
      console.error('Error fetching crypto detail:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCryptoDetail();
  }, [fetchCryptoDetail]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="error">
        <p>{error || 'Cryptocurrency not found'}</p>
        <Link to="/markets" className="back-link">
          <ArrowLeft size={16} />
          Back to Markets
        </Link>
      </div>
    );
  }

  const priceChange24h = crypto.market_data.price_change_percentage_24h;
  const isPositive = priceChange24h >= 0;

  return (
    <div className="crypto-detail">
      <Link to="/markets" className="back-link">
        <ArrowLeft size={16} />
        Back to Markets
      </Link>

      <div className="crypto-header">
        <div className="crypto-title">
          <img src={crypto.image.large} alt={crypto.name} className="crypto-logo" />
          <div className="title-info">
            <h1>{crypto.name}</h1>
            <span className="symbol">{crypto.symbol.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="price-info">
          <div className="current-price">
            {formatPrice(crypto.market_data.current_price.usd)}
          </div>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(priceChange24h).toFixed(2)}% (24h)
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">
            {formatLargeNumber(crypto.market_data.market_cap.usd)}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">24h Volume</div>
          <div className="stat-value">
            {formatLargeNumber(crypto.market_data.total_volume.usd)}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Circulating Supply</div>
          <div className="stat-value">
            {crypto.market_data.circulating_supply?.toLocaleString() || 'N/A'}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Supply</div>
          <div className="stat-value">
            {crypto.market_data.total_supply?.toLocaleString() || 'N/A'}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">All-Time High</div>
          <div className="stat-value">
            {formatPrice(crypto.market_data.ath.usd)}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">All-Time Low</div>
          <div className="stat-value">
            {formatPrice(crypto.market_data.atl.usd)}
          </div>
        </div>
      </div>

      <PriceChart coinId={id} coinName={crypto.name} />

      {crypto.description.en && (
        <div className="description-section">
          <h2>About {crypto.name}</h2>
          <div 
            className="description"
            dangerouslySetInnerHTML={{ 
              __html: crypto.description.en.split('. ')[0] + '.' 
            }}
          />
        </div>
      )}

      {crypto.links && (
        <div className="links-section">
          <h2>Links</h2>
          <div className="links-grid">
            {crypto.links.homepage[0] && (
              <a 
                href={crypto.links.homepage[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-item"
              >
                <Globe size={16} />
                Website
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDetail;