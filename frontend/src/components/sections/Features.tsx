"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function Features() {
  return (
    <section className="min-h-screen bg-white py-20 px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column - Large Image Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-gray-100 rounded-[3rem] h-[800px] relative overflow-hidden group"
        >
          {/* Abstract Image or Video Placeholder */}
          <img 
            src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop" 
            alt="Molecular Structure" 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
          />
          
          <div className="absolute top-10 right-10 flex gap-4">
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <span className="text-xl font-light">i</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <span className="text-xl font-light">▶</span>
            </button>
          </div>

          <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md rounded-3xl p-6 flex items-center gap-6 shadow-xl">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=32" alt="Expert" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=12" alt="Expert" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=5" alt="Expert" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Meet Our Team <br/> Of Experts</h4>
              <button className="text-xs font-semibold text-gray-500 mt-1 border px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">Explore more</button>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col justify-between h-[800px]">
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex justify-between items-start"
          >
            <p className="text-xl text-gray-600 leading-relaxed max-w-sm">
              Driven by a rich history of expertise and a relentless pursuit of scientific excellence
            </p>
            <button className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors">
              LEARN MORE
            </button>
          </motion.div>

          {/* Right Floating Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-gray-100 rounded-[3rem] h-[350px] w-full relative overflow-hidden self-end"
          >
            <img 
              src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1964&auto=format&fit=crop" 
              alt="Molecules" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-[200px] shadow-lg">
              <h4 className="text-lg font-medium text-gray-900 leading-snug mb-3">Good interaction with other molecules</h4>
              <button className="text-xs font-semibold text-white bg-purple-500 px-4 py-1.5 rounded-full hover:bg-purple-600 transition-colors">Learn more</button>
            </div>
          </motion.div>

          {/* Accordion/List */}
          <div className="space-y-10 mt-10">
            {[
              { title: "Unparalleled Diagnostics", desc: "We are at the forefront of personalized health, offering unparalleled diagnostic capabilities." },
              { title: "Global Reach", desc: "VENA has consistently expanded its reach to cater to the evolving needs of healthcare worldwide." },
              { title: "Research Excellence", desc: "VENA excels in the field of clinical research, with specialized models tailored for predictive analysis." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-10 border-t border-gray-100 pt-10"
              >
                <div className="flex items-center gap-4 w-1/3">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{item.title}</h3>
                </div>
                <p className="w-2/3 text-sm text-gray-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
