import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo - Center on mobile */}
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <h1>KOYNCE</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/markets" 
            className={`nav-link ${location.pathname === '/markets' ? 'active' : ''}`}
          >
            Markets
          </Link>
          <Link 
            to="/news" 
            className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`}
          >
            News
          </Link>
          <Link 
            to="/heatmap" 
            className={`nav-link ${location.pathname === '/heatmap' ? 'active' : ''}`}
          >
            Heatmap
          </Link>
        </nav>

        {/* Mobile Navigation Overlay */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            <Link 
              to="/" 
              className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/markets" 
              className={`mobile-nav-link ${location.pathname === '/markets' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Markets
            </Link>
            <Link 
              to="/news" 
              className={`mobile-nav-link ${location.pathname === '/news' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              News
            </Link>
            <Link 
              to="/heatmap" 
              className={`mobile-nav-link ${location.pathname === '/heatmap' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Heatmap
            </Link>
          </div>
        </nav>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
};

export default Header;