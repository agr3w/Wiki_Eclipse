import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Hero } from '../../sections/home/Hero';

export default function Home() {
  const handleOpenAuth = (mode) => {
    console.log(`Abrir modal de autenticação: ${mode}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar onOpenAuth={handleOpenAuth} />
      <main>
        <Hero />
      </main>
    </div>
  );
}
