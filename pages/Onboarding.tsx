import React, { useState, useRef } from 'react';
import { ViewState, BrandProfile } from '../types';
import { Upload, CheckCircle2, Loader2, Palette } from 'lucide-react';
import { fileToGenerativePart, analyzeBrandDNA } from '../services/geminiService';

interface OnboardingProps {
  setView: (view: ViewState) => void;
  setBrand: (brand: BrandProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ setView, setBrand }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Partial<BrandProfile> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const base64 = await fileToGenerativePart(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      // Call Gemini
      const result = await analyzeBrandDNA(base64);
      setAnalysis(result);
      setStep(2);

    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (analysis && analysis.colors && logoPreview) {
      setBrand({
        name: "My School",
        logoUrl: logoPreview,
        colors: {
            primary: analysis.colors.primary || '#000',
            secondary: analysis.colors.secondary || '#888',
            accent: analysis.colors.accent || '#ccff00',
        },
        vibe: analysis.vibe || "Modern",
        fontPairing: analysis.fontPairing || "Sans"
      });
      // Navigate to Command Center instead of Studio
      setView('command-center');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        
        {/* Progress Header */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Brand DNA Setup</h2>
                <p className="text-gray-500 mt-2">Let AI extract your school's identity.</p>
            </div>
            <div className="flex gap-2">
                <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-brand-purple' : 'bg-brand-lime'}`}></div>
                <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-brand-purple' : 'bg-gray-200'}`}></div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left: Upload Area */}
            <div className={`bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Upload size={20} className="text-brand-purple" />
                    Upload School Logo
                </h3>
                
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-brand-purple hover:bg-brand-purple/5 transition-all group"
                >
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="h-40 object-contain drop-shadow-md" />
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="text-gray-400 group-hover:text-brand-purple" />
                            </div>
                            <p className="font-medium text-gray-600">Click to upload logo</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </div>
                
                {logoPreview && !loading && (
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 text-sm text-gray-500 underline hover:text-brand-purple w-full text-center"
                    >
                        Change Image
                    </button>
                )}
            </div>

            {/* Right: Analysis Result */}
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-[2rem]">
                        <Loader2 size={48} className="text-brand-lime animate-spin mb-4" />
                        <p className="font-bold text-gray-700 animate-pulse">Analyzing Brand Geometry...</p>
                        <p className="text-xs text-gray-400 mt-2">Extracting hex codes & mood</p>
                    </div>
                )}

                <div className={`bg-brand-dark text-white rounded-[2rem] p-8 shadow-2xl h-full flex flex-col justify-between ${step === 1 && !loading ? 'opacity-50 blur-[2px]' : ''}`}>
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Palette size={20} className="text-brand-lime" />
                            Extracted Identity
                        </h3>

                        {analysis ? (
                            <div className="space-y-6">
                                {/* Colors */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dominant Palette</p>
                                    <div className="flex gap-4">
                                        {[
                                            { label: 'Primary', hex: analysis.colors?.primary },
                                            { label: 'Secondary', hex: analysis.colors?.secondary },
                                            { label: 'Accent', hex: analysis.colors?.accent }
                                        ].map((col, idx) => (
                                            <div key={idx} className="group relative">
                                                <div 
                                                    className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white/10 cursor-pointer transform transition-transform hover:scale-110"
                                                    style={{ backgroundColor: col.hex }}
                                                ></div>
                                                <p className="text-center text-[10px] mt-2 font-mono text-gray-400">{col.hex}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Vibe */}
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Detected Vibe</p>
                                    <p className="text-lg font-medium text-brand-lime">"{analysis.vibe}"</p>
                                </div>

                                {/* Font */}
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Recommended Typography</p>
                                    <p className="text-lg font-serif italic text-white/90">{analysis.fontPairing}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <p>Waiting for logo...</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleComplete}
                        disabled={!analysis}
                        className="w-full mt-8 py-4 bg-brand-lime text-brand-dark rounded-xl font-bold text-lg hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Go to Command Center
                        <CheckCircle2 size={20} />
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
