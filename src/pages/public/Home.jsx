import React from 'react';
import { Hero } from '../../sections/home/Hero';
import { Synopsis } from '../../sections/home/Synopsis';
import { Highlights } from '../../sections/home/Highlights';
import { CtaBanner } from '../../sections/home/CtaBanner';

export const Home = () => {
  return (
    <main>
      <Hero />
      <Synopsis />
      <Highlights />
      <CtaBanner />
    </main>
  );
};

export default Home;
