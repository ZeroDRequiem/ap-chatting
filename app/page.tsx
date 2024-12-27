import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="p-8">
        <h2 className="text-2xl font-semibold">Welcome to the Next.js + TypeScript Project!</h2>
        <p>This is a simple setup to get started with TypeScript, React, and Next.js.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
