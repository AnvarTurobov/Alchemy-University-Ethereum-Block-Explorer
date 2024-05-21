import React from 'react';

function Navbar() {
  return (
    <nav className="header-bg p-4 text-black">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-lg font-bold">ScanBlock</a>
        <div>
          <a href="#" className="mx-2">Home</a>
          <a href="#" className="mx-2">Blockchain</a>
          <a href="#" className="mx-2">Tokens</a>
          <a href="#" className="mx-2">NFTs</a>
          <a href="#" className="mx-2">Resources</a>
          <a href="#" className="mx-2">Developers</a>
          <a href="#" className="mx-2">More</a>
          <a href="#" className="mx-2">Sign In</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
