import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import ApiDocs from '@/components/sections/ApiDocs';
import Assessment from '@/components/sections/Assessment';

export default function Home() {
  return (
    <div className="font-sans antialiased bg-[#fbfaf8] selection:bg-[#d0ff5a] selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <ApiDocs />
        <Assessment />
      </main>
      
      {/* Footer */}
      <footer className="py-12 px-12 border-t border-gray-200 flex justify-between items-center bg-[#fbfaf8] text-[#516b84] text-sm font-medium">
        <span>© 2026 VENA MLOps Pipeline</span>
        <div className="flex gap-6">
          <a href="https://github.com/eneserbap/Vena" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">GitHub</a>
          <a href="https://vena-kbet.onrender.com/docs" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">API Docs</a>
        </div>
      </footer>
    </div>
  );
}
