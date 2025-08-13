import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import axios from 'axios';
import './CryptoList.css';

// Helper functions for coin data
const getCoinName = (symbol) => {
  const coinNames = {
    'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'BNB': 'BNB', 'XRP': 'XRP', 'ADA': 'Cardano',
    'SOL': 'Solana', 'DOGE': 'Dogecoin', 'DOT': 'Polkadot', 'AVAX': 'Avalanche', 'MATIC': 'Polygon',
    'SHIB': 'Shiba Inu', 'LTC': 'Litecoin', 'TRX': 'TRON', 'UNI': 'Uniswap', 'LINK': 'Chainlink',
    'ATOM': 'Cosmos', 'XMR': 'Monero', 'ETC': 'Ethereum Classic', 'BCH': 'Bitcoin Cash', 'XLM': 'Stellar',
    'ALGO': 'Algorand', 'VET': 'VeChain', 'FIL': 'Filecoin', 'ICP': 'Internet Computer', 'HBAR': 'Hedera',
    'NEAR': 'NEAR Protocol', 'MANA': 'Decentraland', 'SAND': 'The Sandbox', 'CRO': 'Cronos', 'APE': 'ApeCoin'
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
    'MATIC': 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    'SHIB': 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
    'LTC': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
    'TRX': 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
    'UNI': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    'LINK': 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png'
  };
  return coinImages[symbol] || 'https://via.placeholder.com/32';
};

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          limit: '100',
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
          price_change_percentage_24h: parseFloat(coin.change),
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

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchCryptos} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="crypto-list">
      <div className="list-header">
        <h1>Cryptocurrency Markets</h1>
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="crypto-table">
        <div className="table-header">
          <div className="col-rank">#</div>
          <div className="col-name">Name</div>
          <div className="col-price">Price</div>
          <div className="col-change">24h %</div>
          <div className="col-market-cap">Market Cap</div>
        </div>

        <div className="table-body">
          {filteredCryptos.map((crypto) => (
            <Link
              key={crypto.id}
              to={`/crypto/${crypto.id}`}
              className="crypto-row"
            >
              <div className="col-rank">{crypto.market_cap_rank}</div>
              <div className="col-name">
                <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
                <div className="crypto-info">
                  <span className="crypto-name">{crypto.name}</span>
                  <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
                </div>
              </div>
              <div className="col-price">{formatPrice(crypto.current_price)}</div>
              <div className={`col-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                {crypto.price_change_percentage_24h >= 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </div>
              <div className="col-market-cap">{formatMarketCap(crypto.market_cap)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoList;