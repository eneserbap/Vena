"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, ActivitySquare, ArrowRight, Loader2, CheckCircle2, Download } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

export default function Assessment() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ stroke_risk_percentage: number; is_high_risk: boolean; doctors_report?: string } | null>(null);
  const [formData, setFormData] = useState({
    gender: 'Female',
    age: 45,
    hypertension: 0,
    heart_disease: 0,
    Residence_type: 'Urban',
    avg_glucose_level: 105.5,
    bmi: 28.0,
    smoking_status: 'never smoked'
  });
  
  const { toPDF, targetRef } = usePDF({
    filename: `Vena_Clinical_Report.pdf`,
    page: { format: 'A4' }
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vena-kbet.onrender.com');
      const response = await fetch(`${apiUrl}/predict`, {
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
    <section id="assessment" className="min-h-screen bg-[#F8F9FA] py-24 px-10 relative flex justify-center items-center">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-200/50 to-blue-200/50 blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-medium text-gray-900 mb-6">Your Source for Knowledge and Insights</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Enter your clinical parameters to receive an instant, AI-driven assessment of your stroke risk profile.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgb(0,0,0,0.05)] rounded-[3rem] p-12 relative"
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
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Residence Type</label>
                  <div className="flex bg-gray-50 rounded-2xl p-1.5">
                    {['Rural', 'Urban'].map(val => (
                      <button key={val} type="button" onClick={() => setFormData({...formData, Residence_type: val})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${formData.Residence_type === val ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="group relative flex items-center justify-center gap-3 bg-black text-white px-12 py-5 rounded-full font-semibold text-lg transition-all shadow-xl hover:bg-gray-800 disabled:opacity-70"
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
              
              {result.doctors_report && (
                <div className="mt-8 p-6 bg-white border border-gray-100 shadow-sm rounded-2xl text-left relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#d0ff5a]"></div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#d0ff5a]" /> AI Clinical Report
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {result.doctors_report}
                  </p>
                </div>
              )}
              
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4">
                <button 
                  onClick={() => toPDF()}
                  className="px-10 py-4 rounded-full font-semibold text-white bg-black transition-colors shadow-sm hover:bg-gray-800 flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <Download className="w-5 h-5" />
                  Download Official Report
                </button>
                <button 
                  onClick={() => setResult(null)}
                  className="px-10 py-4 rounded-full font-semibold text-gray-600 bg-white border border-gray-200 transition-colors shadow-sm hover:bg-gray-50 w-full md:w-auto justify-center"
                >
                  Start New Check-Up
                </button>
              </div>

              {/* Hidden A4 Template for PDF Generation */}
              <div className="absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-50">
                <div ref={targetRef} className="w-[794px] min-h-[1123px] bg-white p-16 text-black font-sans text-left">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b-4 border-black pb-8 mb-10">
                    <div>
                      <h1 className="text-5xl font-black tracking-tighter mb-2">VENA<span className="text-gray-400">ML</span></h1>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Clinical Decision Support System</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold uppercase mb-1">Report ID</p>
                      <p className="text-xl font-mono bg-gray-100 px-3 py-1 rounded inline-block">VENA-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                      <p className="text-sm text-gray-500 mt-2">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Patient Details */}
                  <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest border-b-2 border-gray-100 pb-2">Patient Demographics & Vitals</h2>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-12 text-base">
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">Age:</span> <span className="font-mono text-lg">{formData.age} Years</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">Gender:</span> <span className="font-mono text-lg">{formData.gender}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">Avg Glucose Level:</span> <span className="font-mono text-lg">{formData.avg_glucose_level} mg/dL</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">BMI:</span> <span className="font-mono text-lg">{formData.bmi}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">Hypertension:</span> <span className="font-mono text-lg">{formData.hypertension === 1 ? 'Positive' : 'Negative'}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">Heart Disease:</span> <span className="font-mono text-lg">{formData.heart_disease === 1 ? 'Positive' : 'Negative'}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">Smoking Status:</span> <span className="font-mono text-lg capitalize">{formData.smoking_status}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                      <span className="font-semibold text-gray-600">Residence Type:</span> <span className="font-mono text-lg">{formData.Residence_type}</span>
                    </div>
                  </div>

                  {/* AI Diagnosis */}
                  <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest border-b-2 border-gray-100 pb-2">AI Diagnostic Result</h2>
                  <div className="bg-gray-50 p-8 rounded-2xl mb-12 border border-gray-200">
                    <div className="flex items-center gap-8">
                      <div className="text-8xl font-light tracking-tighter">
                        {result.stroke_risk_percentage.toFixed(1)}<span className="text-4xl text-gray-400">%</span>
                      </div>
                      <div>
                          <div className={`text-3xl font-black uppercase tracking-widest mb-2 ${result.is_high_risk ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {result.is_high_risk ? 'HIGH RISK DETECTED' : 'LOW RISK DETECTED'}
                          </div>
                          <p className="text-base text-gray-500">Predicted Probability of Stroke Event within clinical timeframe.</p>
                      </div>
                    </div>
                  </div>

                  {/* SHAP Report */}
                  <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest border-b-2 border-gray-100 pb-2">Explainable AI (XAI) Analysis</h2>
                  <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 mb-16">
                    <p className="text-lg leading-relaxed text-gray-800 font-medium">
                      {result.doctors_report}
                    </p>
                  </div>
                  
                  {/* Footer / Sign */}
                  <div className="flex justify-between items-end pt-12 border-t-4 border-black mt-auto">
                    <div className="w-64">
                      <div className="h-16 border-b-2 border-black mb-3"></div>
                      <p className="text-sm font-bold uppercase tracking-widest text-center">Attending Physician</p>
                    </div>
                    <div className="text-sm text-gray-400 text-right leading-relaxed">
                      Generated by Vena MLOps Pipeline v2.0<br/>
                      <span className="font-bold text-gray-500">For research and clinical screening purposes only.</span><br/>
                      Not a substitute for professional medical diagnosis.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
