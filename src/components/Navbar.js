import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="header-bg p-4 text-black">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" style={{ color: '#0ABAB5' }} className="text-lg md:text-xl font-bold">
          ScanBlock
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
