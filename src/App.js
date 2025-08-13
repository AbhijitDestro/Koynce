import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import CryptoList from './components/CryptoList';
import CryptoDetail from './components/CryptoDetail';
import News from './components/News';
import CryptoHeatmap from './components/CryptoHeatmap';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      <Header />
      <main className={`main-content ${isHomePage ? 'home-page' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<CryptoList />} />
          <Route path="/crypto/:id" element={<CryptoDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/heatmap" element={<CryptoHeatmap />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;