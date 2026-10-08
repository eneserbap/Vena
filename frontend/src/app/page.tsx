import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Process from '@/components/sections/Process';
import Features from '@/components/sections/Features';
import Assessment from '@/components/sections/Assessment';

export default function Home() {
  return (
    <div className="font-sans antialiased bg-white selection:bg-purple-200">
      <Navbar />
      <main>
        <Hero />
        <Process />
        <Features />
        <Assessment />
      </main>
      
      {/* Minimal Footer */}
      <footer className="py-10 px-10 border-t border-gray-100 flex justify-between items-center bg-white text-gray-500 text-sm font-medium">
        <span>© 2026 VENA MLOps Pipeline</span>
        <div className="flex gap-6">
          <a href="https://github.com/eneserbap/Vena" className="hover:text-black transition-colors">GitHub</a>
          <a href="https://vena-kbet.onrender.com/docs" className="hover:text-black transition-colors">API Docs</a>
        </div>
      </footer>
    </div>
  );
}
