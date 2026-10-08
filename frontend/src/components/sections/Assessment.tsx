"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, ActivitySquare, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function Assessment() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ stroke_risk_percentage: number; is_high_risk: boolean } | null>(null);
  const [formData, setFormData] = useState({
    gender: 'Female',
    age: 45,
    hypertension: 0,
    heart_disease: 0,
    ever_married: 'Yes',
    work_type: 'Private',
    Residence_type: 'Urban',
    avg_glucose_level: 105.5,
    bmi: 28.0,
    smoking_status: 'never smoked'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi'].includes(name) 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://vena-kbet.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setResult(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('API Connection Failed. Please ensure Render backend is awake.');
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8F9FA] py-32 px-10 relative overflow-hidden flex justify-center items-center">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-200/50 to-blue-200/50 blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">Vena Model Check-Up</span>
          <h2 className="text-5xl font-medium text-gray-900 mb-6">Your Source for Knowledge and Insights</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Enter your clinical parameters to receive an instant, AI-driven assessment of your stroke risk profile.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgb(0,0,0,0.05)] rounded-[3rem] p-12 relative overflow-hidden"
        >
          {!result ? (
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 transition-all font-medium text-lg" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 transition-all appearance-none font-medium text-lg cursor-pointer">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><ActivitySquare className="w-4 h-4 text-purple-400"/> Avg Glucose Level</label>
                  <input type="number" step="0.1" name="avg_glucose_level" value={formData.avg_glucose_level} onChange={handleInputChange} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 transition-all font-medium text-lg" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400"/> BMI</label>
                  <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleInputChange} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 transition-all font-medium text-lg" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Hypertension</label>
                  <div className="flex bg-gray-50 rounded-2xl p-1.5">
                    {[0, 1].map(val => (
                      <button key={val} type="button" onClick={() => setFormData({...formData, hypertension: val})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${formData.hypertension === val ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                        {val === 0 ? 'No' : 'Yes'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400"/> Heart Disease</label>
                  <div className="flex bg-gray-50 rounded-2xl p-1.5">
                    {[0, 1].map(val => (
                      <button key={val} type="button" onClick={() => setFormData({...formData, heart_disease: val})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${formData.heart_disease === val ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                        {val === 0 ? 'No' : 'Yes'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Smoking Status</label>
                  <select name="smoking_status" value={formData.smoking_status} onChange={handleInputChange} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 transition-all appearance-none font-medium text-lg cursor-pointer">
                    <option value="never smoked">Never Smoked</option>
                    <option value="formerly smoked">Formerly Smoked</option>
                    <option value="smokes">Smokes</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Work Type</label>
                  <select name="work_type" value={formData.work_type} onChange={handleInputChange} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 transition-all appearance-none font-medium text-lg cursor-pointer">
                    <option value="Private">Private Sector</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Govt_job">Government Job</option>
                  </select>
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="group relative flex items-center justify-center gap-3 bg-black text-white px-12 py-5 rounded-full font-semibold text-lg transition-all shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? (
                    <><Loader2 className="w-6 h-6 animate-spin text-purple-400" /> Analyzing...</>
                  ) : (
                    <>Run Diagnostics <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="relative z-10 text-center py-10 animate-in fade-in zoom-in-95 duration-700">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 block">Stroke Risk Probability</span>
              
              <div className="flex items-baseline justify-center gap-2 mb-8">
                <span className={`text-[10rem] font-light tracking-tighter leading-none ${result.is_high_risk ? 'text-rose-500' : 'text-gray-900'}`}>
                  {result.stroke_risk_percentage.toFixed(1)}
                </span>
                <span className="text-4xl font-medium text-gray-300">%</span>
              </div>

              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mt-2 p-0.5 border border-gray-200">
                <div 
                  className={`h-full rounded-full transition-all duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] ${result.is_high_risk ? 'bg-gradient-to-r from-orange-400 to-rose-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                  style={{ width: `${result.stroke_risk_percentage}%` }}
                ></div>
              </div>
              
              <div className="mt-12">
                <button 
                  onClick={() => setResult(null)}
                  className="px-10 py-4 rounded-full font-semibold text-gray-600 bg-white border border-gray-200 transition-colors shadow-sm hover:shadow"
                >
                  Start New Check-Up
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
