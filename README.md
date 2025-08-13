# KOYNCE - Cryptocurrency Tracker

A modern, responsive cryptocurrency tracking application built with React that provides real-time market data, interactive charts, and the latest crypto news.

## 🚀 Features

### 📊 **Real-time Market Data**
- Live cryptocurrency prices from Coinranking API
- Top 100+ cryptocurrencies by market cap
- 24h price changes with visual indicators
- Market cap and trading volume information
- Search functionality to find specific coins

### 📈 **Interactive Price Charts**
- Historical price data with multiple timeframes (24H, 7D, 30D, 90D, 1Y)
- Interactive charts powered by Recharts
- Real-time price change calculations
- Responsive chart design for all devices

### 🔥 **Market Heatmap**
- Visual representation of market performance
- Interactive bubble chart sized by market cap/volume
- Color-coded price changes (green for gains, red for losses)
- Multiple sorting options and timeframes

### 📰 **Crypto News**
- Latest cryptocurrency news and updates
- Clean, card-based news layout
- Responsive news grid for all devices

### 🎨 **Modern UI/UX**
- **Dark/Light Theme Toggle** - Seamless switching between themes
- **Fully Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Mobile Hamburger Menu** - Clean navigation on mobile devices
- **Professional Design** - Modern gradient effects and smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.3.0
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React 0.263.1
- **HTTP Client**: Axios 1.4.0
- **Styling**: CSS3 with CSS Custom Properties
- **API**: Coinranking API

## 📱 Responsive Design

- **Desktop**: Full-featured layout with horizontal navigation
- **Tablet**: Optimized grid layouts and touch-friendly controls
- **Mobile**: Hamburger menu, stacked layouts, and optimized spacing

## 🎯 Pages & Navigation

1. **Home** (`/`) - Hero section with top 10 cryptocurrencies and news preview
2. **Markets** (`/markets`) - Complete cryptocurrency listings with search
3. **Crypto Details** (`/crypto/:id`) - Individual coin details with charts
4. **News** (`/news`) - Latest cryptocurrency news and updates
5. **Heatmap** (`/heatmap`) - Interactive market visualization

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/koynce-crypto-tracker.git
   cd koynce-crypto-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🔧 Configuration

The app uses the Coinranking API for cryptocurrency data. The API configuration is already set up in the components, but you can modify the API endpoints in:

- `src/components/Home.js`
- `src/components/CryptoList.js`
- `src/components/CryptoDetail.js`
- `src/components/PriceChart.js`
- `src/components/CryptoHeatmap.js`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header.js        # Navigation header with theme toggle
│   ├── Home.js          # Homepage with hero and previews
│   ├── CryptoList.js    # Markets page with all cryptocurrencies
│   ├── CryptoDetail.js  # Individual cryptocurrency details
│   ├── PriceChart.js    # Interactive price charts
│   ├── CryptoHeatmap.js # Market heatmap visualization
│   └── News.js          # Crypto news page
├── context/             # React context providers
│   └── ThemeContext.js  # Dark/light theme management
├── styles/              # CSS files
│   └── design-system.css # Complete design system template
├── App.js               # Main app component
├── App.css              # Global app styles
├── index.js             # App entry point
└── index.css            # Global CSS with theme variables
```

## 🎨 Design System

The app includes a comprehensive design system with:

- **CSS Custom Properties** for theming
- **Responsive breakpoints** (1200px, 992px, 768px, 480px)
- **Typography scale** (6 heading levels + text sizes)
- **Button system** (primary, secondary, accent, success, danger)
- **Card components** with hover effects
- **Form elements** with consistent styling
- **Utility classes** for spacing, layout, and animations

## 🌙 Theme System

### Light Theme
- Clean white backgrounds
- Dark text for readability
- Blue accent colors
- Subtle shadows

### Dark Theme
- True black backgrounds (`#000000`)
- White text for contrast
- Bright accent colors
- Enhanced shadows

## 📱 Mobile Features

- **Hamburger Menu**: Clean slide-out navigation
- **Touch-Friendly**: Large buttons and proper spacing
- **Responsive Charts**: Optimized chart sizes for mobile
- **Full-Width Heatmap**: Utilizes entire screen width
- **Optimized Typography**: Scaled text for readability

## 🔄 API Integration

### Coinranking API Endpoints Used:
- `/coins` - List of cryptocurrencies with market data
- `/coin/{uuid}` - Individual cryptocurrency details
- `/coin/{uuid}/history` - Historical price data for charts

## 🎯 Key Features Breakdown

### Market Data
- Real-time prices and market caps
- 24h volume and price changes
- Circulating and total supply
- All-time high/low prices
- Market cap rankings

### Interactive Elements
- Hover effects on all interactive components
- Smooth theme transitions
- Loading states and error handling
- Search functionality with real-time filtering
- Responsive navigation with mobile menu

### Performance Optimizations
- Efficient React hooks usage
- Optimized re-renders with useCallback
- Responsive images and icons
- Minimal bundle size with tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Coinranking API](https://coinranking.com/api) for cryptocurrency data
- [Recharts](https://recharts.org/) for beautiful charts
- [Lucide React](https://lucide.dev/) for modern icons
- [Unsplash](https://unsplash.com/) for news placeholder images


---

**Built with ❤️ using React and modern web technologies**
