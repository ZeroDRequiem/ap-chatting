import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 p-4 text-center">
      <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
