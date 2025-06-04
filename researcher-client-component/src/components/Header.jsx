import React from 'react';
import OutReachLogo from '../assets/OutReachLogo-Photoroom.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <img 
          src={OutReachLogo} 
          alt="OutReach Logo" 
          className="outreach-logo" 
        />
      </div>
    </header>
  );
};

export default Header; 