import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import './PriceChart.css';

const PriceChart = ({ coinId, coinName }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7');
  const [priceChange, setPriceChange] = useState(0);

  const timeRanges = [
    { value: '1', label: '24H' },
    { value: '7', label: '7D' },
    { value: '30', label: '30D' },
    { value: '90', label: '90D' },
    { value: '365', label: '1Y' }
  ];

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      
      const options = {
        method: 'GET',
        url: `https://coinranking1.p.rapidapi.com/coin/${coinId}/history`,
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: timeRange === '1' ? '24h' : timeRange === '7' ? '7d' : timeRange === '30' ? '30d' : timeRange === '90' ? '3m' : '1y'
        },
        headers: {
          'x-rapidapi-key': 'd8fa8b0f91mshd5f5c92b09a7ab4p1b4246jsn09be59b34bca',
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      
      if (response.data.status === 'success') {
        const history = response.data.data.history;
        
        const formattedData = history.map((point) => ({
          timestamp: point.timestamp * 1000, // Convert to milliseconds
          price: parseFloat(point.price),
          date: new Date(point.timestamp * 1000).toLocaleDateString(),
          time: new Date(point.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })).reverse(); // Reverse to get chronological order

        setChartData(formattedData);
        
        // Calculate price change
        if (formattedData.length > 1) {
          const firstPrice = formattedData[0].price;
          const lastPrice = formattedData[formattedData.length - 1].price;
          const change = ((lastPrice - firstPrice) / firstPrice) * 100;
          setPriceChange(change);
        }
      } else {
        throw new Error('Failed to fetch chart data');
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch chart data');
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  }, [coinId, timeRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatTooltipLabel = (label) => {
    const date = new Date(label);
    if (timeRange === '1') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{formatTooltipLabel(label)}</p>
          <p className="tooltip-price">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h2>Price Chart</h2>
        </div>
        <div className="chart-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h2>Price Chart</h2>
        </div>
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchChartData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isPositive = priceChange >= 0;
  const lineColor = isPositive ? '#68d391' : '#fc8181';

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <h2>{coinName} Price Chart</h2>
          <div className={`price-change-indicator ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(priceChange).toFixed(2)}% ({timeRanges.find(r => r.value === timeRange)?.label})
          </div>
        </div>
        
        <div className="time-range-selector">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`time-range-btn ${timeRange === range.value ? 'active' : ''}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatTooltipLabel}
              stroke="var(--text-muted)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toFixed(value < 1 ? 4 : 0)}`}
              stroke="var(--text-muted)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;