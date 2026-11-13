import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HabitTrackerCore } from '../components/habits/HabitTrackerCore';

export const HabitTrackerPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF5EB] text-[#171717]">
      <Navbar />
      <main className="flex-1">
        <HabitTrackerCore mode="standalone" />
      </main>
      <Footer />
    </div>
  );
};
