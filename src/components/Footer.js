import React from 'react';
import { Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a 
          href="https://github.com/AbhijitDestro" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-button"
        >
          <Github size={20} className="github-icon" />
          <p>Built by AbhijitDestro</p>
        </a>
      </div>
    </footer>
  );
};

export default Footer;