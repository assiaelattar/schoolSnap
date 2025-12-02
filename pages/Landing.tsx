import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, Wand2, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

interface LandingProps {
  setView: (view: ViewState) => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="relative w-full min-h-screen pt-24 pb-20 overflow-hidden bg-white">
      {/* Background Shapes */}
      <div className="absolute top-20 right-0 w-[800px] h-[800px] bg-brand-lime/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mt-12 mb-32">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200">
              <span className="flex h-2 w-2 rounded-full bg-brand-lime animate-pulse"></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">AI Design Agent V1.0</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Elevate Your <br/>
              <span className="relative inline-block">
                School Brand
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-lime" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> <br/>
              with <span className="text-brand-purple">Creative Magic</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
              SchoolSnap Studio acts as your intelligent design partner. Turn messy teacher photos into professional, branded assets in seconds. No design skills required.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={() => setView('onboarding')}
                className="group px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Start Creating
                <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </button>
              <button className="px-8 py-4 bg-white text-gray-600 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                View Demo
              </button>
            </div>

            {/* Trusted By */}
            <div className="pt-12 border-t border-gray-100 mt-8">
              <p className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Trusted by modern educators</p>
              <div className="flex gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Mock Logos */}
                <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
                <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
                <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
                <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Right Visuals - Floating Cards */}
          <div className="flex-1 relative w-full h-[600px] hidden lg:block">
            {/* Main Floating Card */}
            <div className="absolute top-10 left-10 w-[420px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 z-20 animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold">L</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Libertans High</h3>
                    <p className="text-xs text-gray-400">Marketing Team</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
              </div>
              <div className="relative aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden group">
                 <img src="https://picsum.photos/seed/school/600/800" alt="Student" className="w-full h-full object-cover" />
                 
                 {/* AI Overlay UI */}
                 <div className="absolute inset-x-4 bottom-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-1.5 bg-brand-lime rounded-full">
                        <Wand2 size={14} className="text-brand-dark" />
                      </div>
                      <span className="text-xs font-bold text-brand-dark">AI Enhancement</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">Lighting corrected. Brand colors applied. Logo overlaid on safe zone.</p>
                 </div>
              </div>
            </div>

            {/* Secondary Floating Card (Behind) */}
            <div className="absolute top-40 right-10 w-[300px] h-[350px] bg-brand-dark rounded-[2.5rem] shadow-xl z-10 rotate-3 p-6 flex flex-col justify-between">
               <div>
                  <h4 className="text-white font-bold text-xl mb-2">Design Stats</h4>
                  <div className="flex gap-2">
                    <span className="h-2 w-12 bg-brand-lime rounded-full"></span>
                    <span className="h-2 w-6 bg-gray-700 rounded-full"></span>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="bg-white/10 p-3 rounded-2xl flex items-center gap-3">
                     <ImageIcon size={20} className="text-brand-lime" />
                     <span className="text-gray-300 text-sm">34 Assets Generated</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl flex items-center gap-3">
                     <LayoutTemplate size={20} className="text-brand-purple" />
                     <span className="text-gray-300 text-sm">5 Campaign Templates</span>
                  </div>
               </div>
            </div>

             {/* Sticker */}
            <div className="absolute bottom-20 right-40 z-30">
               <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-brand-lime rounded-full blur animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-brand-lime rounded-full flex items-center justify-center border-4 border-white transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                     <div className="text-center leading-none">
                        <span className="block text-xs font-bold text-brand-dark">TRY</span>
                        <span className="block text-xl font-extrabold text-brand-dark">FREE</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Market Research", desc: "Analyzes trends to suggest relevant content.", color: "bg-brand-dark text-white", icon: "text-brand-lime" },
            { title: "Ads Production", desc: "Automated layouts for social, print, and web.", color: "bg-brand-purple text-white", icon: "text-white" },
            { title: "Branding Strategy", desc: "Enforces your hex codes and fonts automatically.", color: "bg-gray-100 text-gray-900", icon: "text-brand-dark" },
          ].map((feature, idx) => (
             <div key={idx} className={`p-8 rounded-[2rem] ${feature.color} relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-2`}>
                <div className="relative z-10">
                   <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                   <p className="text-sm opacity-80 mb-12">{feature.desc}</p>
                   <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center ${feature.icon}`}>
                      <ArrowRight size={24} />
                   </div>
                </div>
                {/* Hover Effect */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
             </div>
          ))}
        </div>

      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};
