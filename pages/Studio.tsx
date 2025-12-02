
import React, { useState, useRef } from 'react';
import { ViewState, BrandProfile, ModuleId, DesignStyle, CampaignStrategy, AssetFormat, CampaignAsset, AspectRatio, LayoutStyle, DesignTemplate } from '../types';
import { 
    Image as ImageIcon, Sparkles, Download, 
    ArrowLeft, Wand2, Upload, Loader2,
    CheckCircle2, Globe, Smartphone, Square, ArrowRight,
    ExternalLink, Phone, Monitor, Copy, Grid
} from 'lucide-react';
import { generateMarketingAsset, analyzeImageQuality, fileToGenerativePart, generateCampaignStrategy } from '../services/geminiService';

interface StudioProps {
  setView: (view: ViewState) => void;
  brand: BrandProfile | null;
  activeModuleId: ModuleId;
}

type StudioMode = 'briefing' | 'thinking' | 'presentation';

export const Studio: React.FC<StudioProps> = ({ setView, brand, activeModuleId }) => {
  const [mode, setMode] = useState<StudioMode>('briefing');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [imageCritique, setImageCritique] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>('soft-modern');
  
  // Strategy & Assets
  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null);
  const [assets, setAssets] = useState<Record<AssetFormat, CampaignAsset>>({
      feed: { id: '1', format: 'feed', aspectRatio: '1:1', imageUrl: null, layout: 'hero' },
      story: { id: '2', format: 'story', aspectRatio: '9:16', imageUrl: null, layout: 'split' },
      banner: { id: '3', format: 'banner', aspectRatio: '16:9', imageUrl: null, layout: 'frame' }
  });
  
  const [activeTab, setActiveTab] = useState<AssetFormat>('feed');

  // Contact Info
  const contactInfo = {
      website: 'www.school.edu',
      phone: '(555) 123-4567'
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const colors = brand?.colors || { primary: '#4f46e5', secondary: '#1e1b4b', accent: '#ccff00' };

  // --- TEMPLATE DEFINITIONS ---
  const templates: DesignTemplate[] = [
      {
          id: 'swiss',
          label: 'Swiss International',
          description: 'Grid-based, clean typography, high contrast.',
          previewColor: 'bg-red-50'
      },
      {
          id: 'bold-school',
          label: 'Bold School',
          description: 'Neo-brutalist, hard shadows, vibrant borders.',
          previewColor: 'bg-yellow-50'
      },
      {
          id: 'soft-modern',
          label: 'Soft Modern',
          description: 'Rounded, glassmorphism, friendly gradients.',
          previewColor: 'bg-blue-50'
      },
      {
          id: 'tech-future',
          label: 'Tech Future',
          description: 'Dark mode, neon accents, cyber aesthetics.',
          previewColor: 'bg-slate-900'
      }
  ];

  // --- HANDLERS ---

  const handleSourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const base64 = await fileToGenerativePart(file);
        setSourceImage(base64); 
        const critique = await analyzeImageQuality(base64);
        setImageCritique(critique);
    } catch (err) {
        console.error(err);
    }
  };

  const handleCreateCampaign = async () => {
      if (!brand || !topicInput) return;
      setMode('thinking');

      const strat = await generateCampaignStrategy(topicInput, brand.name, selectedStyle, imageCritique);
      setStrategy(strat);

      const promises = (['feed', 'story', 'banner'] as AssetFormat[]).map(async (format) => {
          const assetConfig = assets[format];
          const imageUrl = await generateMarketingAsset(sourceImage, brand, strat.artDirection, assetConfig.aspectRatio);
          return { format, imageUrl };
      });

      const results = await Promise.all(promises);

      setAssets(prev => {
          const next = { ...prev };
          results.forEach(res => {
              if (next[res.format]) {
                  next[res.format].imageUrl = res.imageUrl;
              }
          });
          return next;
      });

      setMode('presentation');
  };

  const handleDownload = async (id: string) => {
      const element = document.getElementById(`canvas-${id}`);
      if (!element) return;
      try {
          // @ts-ignore
          const canvas = await window.html2canvas(element, { useCORS: true, scale: 2 });
          const link = document.createElement('a');
          link.download = `SchoolSnap-${id}-${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
      } catch (err) {
          console.error("Export failed", err);
      }
  };

  // --- COMPOSITING ENGINE ---
  const Compositor = ({ asset, context }: { asset: CampaignAsset, context: CampaignStrategy }) => {
      const { headline, subhead, cta } = context;
      const { imageUrl, format } = asset;
      const style = selectedStyle;
      
      const isBanner = format === 'banner';
      const isStory = format === 'story';

      // --- STYLE: SWISS INTERNATIONAL ---
      if (style === 'swiss') {
          return (
              <div id={`canvas-${asset.id}`} className="relative w-full h-full bg-white overflow-hidden text-gray-900 font-sans">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none z-20">
                       <div className="border-r border-red-500/10 h-full col-start-2"></div>
                       <div className="border-r border-red-500/10 h-full col-start-4"></div>
                       <div className="border-b border-red-500/10 w-full row-start-2"></div>
                       <div className="border-b border-red-500/10 w-full row-start-5"></div>
                  </div>

                  {/* Image */}
                  <div className={`absolute ${isStory ? 'inset-x-0 top-0 h-2/3' : isBanner ? 'inset-y-0 right-0 w-1/2' : 'inset-x-0 top-0 h-1/2'} z-0`}>
                      {imageUrl && <img src={imageUrl} className="w-full h-full object-cover grayscale contrast-125" alt="bg" />}
                      <div className="absolute inset-0 bg-red-500 mix-blend-multiply opacity-20"></div>
                  </div>

                  {/* Text Container */}
                  <div className={`absolute ${isStory ? 'inset-x-0 bottom-0 h-1/3 p-8' : isBanner ? 'inset-y-0 left-0 w-1/2 p-12' : 'inset-x-0 bottom-0 h-1/2 p-8'} bg-white z-10 flex flex-col justify-between`}>
                      <div>
                          <div className="w-12 h-1 bg-gray-900 mb-4"></div>
                          <h2 className={`font-black tracking-tighter uppercase leading-[0.9] ${isBanner ? 'text-5xl' : 'text-4xl'}`}>
                              {headline}
                          </h2>
                          <p className="mt-4 text-sm font-medium leading-tight max-w-[80%]">{subhead}</p>
                      </div>
                      <div className="flex items-end justify-between border-t-2 border-gray-900 pt-4 mt-4">
                           <div className="text-xs font-bold uppercase tracking-widest">{cta} →</div>
                           <div className="text-[10px] font-mono">{contactInfo.website}</div>
                      </div>
                  </div>
                  
                  {/* Floating Logo */}
                  <div className="absolute top-4 left-4 z-30 bg-gray-900 text-white p-2">
                       {brand?.logoUrl && <img src={brand.logoUrl} className="w-8 h-8 object-contain invert" />}
                  </div>
              </div>
          );
      }

      // --- STYLE: BOLD SCHOOL (NEO-BRUTALIST) ---
      if (style === 'bold-school') {
          return (
              <div id={`canvas-${asset.id}`} className="relative w-full h-full bg-[#f0f0f0] overflow-hidden font-sans border-8 border-gray-900">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '20px 20px'}}></div>

                  {/* Image Card */}
                  <div className={`absolute border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white z-0
                      ${isStory ? 'inset-x-6 top-6 h-3/5 rounded-none' : isBanner ? 'right-8 top-8 bottom-8 w-1/2' : 'inset-x-6 top-6 h-1/2'}`}>
                      {imageUrl && <img src={imageUrl} className="w-full h-full object-cover" alt="bg" />}
                  </div>

                  {/* Text Block */}
                  <div className={`absolute z-10 bg-${colors.primary === '#4f46e5' ? 'yellow-400' : 'brand-lime'} border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6
                      ${isStory ? 'bottom-12 left-6 right-6' : isBanner ? 'left-12 top-12 bottom-12 w-1/3 flex flex-col justify-center' : 'bottom-6 left-6 right-6'}`}>
                      <h2 className="text-3xl font-black text-gray-900 uppercase leading-none mb-2">{headline}</h2>
                      <p className="text-xs font-bold text-gray-900 border-t-2 border-gray-900 pt-2 mb-4">{subhead}</p>
                      <button className="bg-white border-2 border-gray-900 px-4 py-2 font-black uppercase text-xs hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                          {cta}
                      </button>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-0 right-0 bg-gray-900 text-white p-2 font-mono text-xs font-bold rotate-0 border-l-4 border-b-4 border-white">
                      {brand?.name}
                  </div>
              </div>
          );
      }

      // --- STYLE: TECH FUTURE ---
      if (style === 'tech-future') {
          return (
              <div id={`canvas-${asset.id}`} className="relative w-full h-full bg-slate-900 overflow-hidden font-mono text-white">
                   {/* Cyber Grid */}
                   <div className="absolute inset-0" style={{backgroundImage: `linear-gradient(to right, ${colors.accent}10 1px, transparent 1px), linear-gradient(to bottom, ${colors.accent}10 1px, transparent 1px)`, backgroundSize: '40px 40px'}}></div>
                   
                   {/* Image Glitch Container */}
                   <div className="absolute inset-0 z-0 opacity-60">
                       {imageUrl && <img src={imageUrl} className="w-full h-full object-cover mix-blend-luminosity" alt="bg" />}
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                   </div>

                   {/* HUD Elements */}
                   <div className="absolute top-4 left-4 border border-white/20 p-1 flex gap-2">
                       <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
                       <span className="text-[8px] uppercase tracking-widest text-white/50">LIVE_FEED</span>
                   </div>
                   <div className="absolute top-4 right-4 text-[8px] text-right text-white/50">
                       {contactInfo.website}<br/>SYS.ID.8842
                   </div>

                   {/* Content */}
                   <div className={`absolute p-8 z-10 flex flex-col justify-end ${isStory ? 'inset-0' : isBanner ? 'inset-0 w-2/3' : 'inset-0'}`}>
                       <h2 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2" style={{textShadow: `0 0 20px ${colors.accent}`}}>
                           {headline}
                       </h2>
                       <div className="h-0.5 w-24 bg-brand-lime mb-4 shadow-[0_0_10px_#ccff00]"></div>
                       <p className="text-xs text-blue-200 mb-6 max-w-sm">{subhead}</p>
                       
                       <div className="inline-flex items-center gap-2 border border-brand-lime/50 px-4 py-2 rounded bg-brand-lime/10">
                           <span className="text-brand-lime font-bold text-xs uppercase tracking-wider">[{cta}]</span>
                       </div>
                   </div>
              </div>
          );
      }

      // --- STYLE: SOFT MODERN (Default/Fallback) ---
      return (
          <div id={`canvas-${asset.id}`} className="relative w-full h-full bg-white overflow-hidden">
               {/* Image Full Bleed */}
               <div className="absolute inset-0 z-0">
                   {imageUrl && <img src={imageUrl} className="w-full h-full object-cover" alt="bg" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
               </div>

               {/* Glass Card */}
               <div className={`absolute z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl flex flex-col
                   ${isStory ? 'bottom-8 left-4 right-4' : isBanner ? 'bottom-8 left-8 w-1/3' : 'bottom-6 left-6 right-6'}`}>
                   
                   <div className="flex items-center gap-2 mb-3">
                        {brand?.logoUrl && <img src={brand.logoUrl} className="w-6 h-6 object-contain drop-shadow-lg" />}
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{brand?.name}</span>
                   </div>

                   <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{headline}</h2>
                   <p className="text-xs text-white/80 font-medium mb-4">{subhead}</p>
                   
                   <div className="flex justify-between items-center mt-2">
                       <span className="bg-white text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase shadow-lg transform hover:scale-105 transition-transform">{cta}</span>
                       <div className="text-[9px] text-white/60">{contactInfo.website}</div>
                   </div>
               </div>
          </div>
      );
  };

  // --- VIEW: BRIEFING ---
  if (mode === 'briefing') {
      return (
          <div className="h-screen bg-gray-50 flex items-center justify-center p-6">
              <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                  
                  {/* Left: Input */}
                  <div className="w-full md:w-5/12 p-10 flex flex-col border-r border-gray-100">
                      <div className="flex items-center gap-3 mb-8">
                          <button onClick={() => setView('command-center')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><ArrowLeft size={20} /></button>
                          <div>
                              <h1 className="text-2xl font-black text-gray-900">Design Agent</h1>
                              <p className="text-xs text-gray-400">Brief the AI to create your campaign</p>
                          </div>
                      </div>

                      <div className="space-y-8 flex-1">
                          {/* 1. Image Upload */}
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">1. Source Footage (Required)</label>
                              <div onClick={() => fileInputRef.current?.click()} className={`relative h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group hover:border-brand-purple hover:bg-brand-purple/5 ${sourceImage ? 'border-brand-purple bg-brand-purple/5' : 'border-gray-200'}`}>
                                  {sourceImage ? (
                                      <img src={`data:image/jpeg;base64,${sourceImage}`} className="h-full object-contain shadow-sm" />
                                  ) : (
                                      <div className="text-center text-gray-400 group-hover:text-brand-purple">
                                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-purple group-hover:text-white transition-colors">
                                             <Upload size={20} />
                                          </div>
                                          <span className="text-xs font-bold">Click to Upload Photo</span>
                                          <p className="text-[10px] mt-1 opacity-70">The AI will transform & enhance this image</p>
                                      </div>
                                  )}
                                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleSourceUpload} />
                              </div>
                          </div>

                          {/* 2. Topic */}
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">2. What's happening?</label>
                              <textarea 
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                placeholder="e.g. Science Fair finals are happening this Friday in the main hall..."
                                className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-purple resize-none text-sm text-gray-900 placeholder-gray-400"
                              />
                          </div>
                      </div>

                      <button 
                        onClick={handleCreateCampaign}
                        disabled={!topicInput}
                        className="mt-8 w-full py-4 bg-brand-dark text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                      >
                          <Wand2 size={20} className="text-brand-lime" />
                          Generate Campaign Bundle
                      </button>
                  </div>

                  {/* Right: Template Gallery */}
                  <div className="w-full md:w-7/12 bg-gray-50/50 p-10">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 block">3. Select a Pro Template</label>
                       
                       <div className="grid grid-cols-2 gap-6">
                           {templates.map((tpl) => (
                               <div 
                                 key={tpl.id}
                                 onClick={() => setSelectedStyle(tpl.id)}
                                 className={`relative group cursor-pointer bg-white rounded-3xl p-5 border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedStyle === tpl.id ? 'border-brand-purple ring-4 ring-brand-purple/10' : 'border-transparent hover:border-gray-200'}`}
                               >
                                   <div className={`h-24 w-full rounded-2xl mb-4 ${tpl.previewColor} relative overflow-hidden shadow-inner`}>
                                       {/* Mini Visual Abstractions */}
                                       {tpl.id === 'swiss' && <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-20"><div className="bg-red-500"></div><div className="col-span-2 bg-black"></div></div>}
                                       {tpl.id === 'bold-school' && <div className="absolute top-4 left-4 w-12 h-12 border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_black]"></div>}
                                       {tpl.id === 'tech-future' && <div className="absolute inset-0 bg-slate-900 flex items-center justify-center"><div className="w-full h-[1px] bg-green-400 shadow-[0_0_10px_lime]"></div></div>}
                                       {tpl.id === 'soft-modern' && <div className="absolute inset-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/50"></div>}
                                   </div>
                                   
                                   <div className="flex justify-between items-start">
                                       <div>
                                           <h3 className="font-bold text-gray-900">{tpl.label}</h3>
                                           <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tpl.description}</p>
                                       </div>
                                       {selectedStyle === tpl.id && <CheckCircle2 className="text-brand-purple" size={20} />}
                                   </div>
                               </div>
                           ))}
                       </div>

                       {/* Brand DNA Card */}
                       <div className="mt-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                           <div className="flex -space-x-2">
                               <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{backgroundColor: colors.primary}}></div>
                               <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{backgroundColor: colors.accent}}></div>
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-900">Auto-Branding Active</p>
                               <p className="text-[10px] text-gray-500">Your logo & hex codes will be applied to the template.</p>
                           </div>
                       </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- VIEW: THINKING (Agent Working) ---
  if (mode === 'thinking') {
      return (
          <div className="h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-lime/10 via-transparent to-transparent blur-3xl"></div>
              
              <div className="relative z-10 text-center space-y-8 max-w-md">
                  <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-brand-purple rounded-full border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto text-brand-lime animate-pulse" size={32} />
                  </div>
                  
                  <div>
                      <h2 className="text-3xl font-black text-gray-900 mb-4">Crafting Campaign</h2>
                      <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                              <Loader2 size={16} className="animate-spin" />
                              <span>Transforming source footage...</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl opacity-50">
                              <Grid size={16} />
                              <span>Applying {templates.find(t => t.id === selectedStyle)?.label} layout...</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl opacity-30">
                              <Copy size={16} />
                              <span>Writing captions & hashtags...</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- VIEW: PRESENTATION ---
  return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
              <div className="flex items-center gap-4">
                  <button onClick={() => setMode('briefing')} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><ArrowLeft size={20} /></button>
                  <div>
                      <h1 className="text-lg font-bold text-gray-900">{strategy?.headline || 'Campaign Ready'}</h1>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full uppercase tracking-wider">{selectedStyle.replace('-', ' ')}</span>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{strategy?.subhead}</p>
                      </div>
                  </div>
              </div>
              <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 border border-gray-200">
                      <Copy size={16} /> Copy Caption
                  </button>
                  <button onClick={() => setMode('briefing')} className="px-4 py-2 text-sm font-bold bg-brand-dark text-white rounded-lg hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all">
                      New Campaign
                  </button>
              </div>
          </div>

          <div className="flex-1 p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
              
              {/* Left: Asset Preview */}
              <div className="flex-1 flex flex-col">
                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
                      <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'feed' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                          <Square size={16} /> Feed Post
                      </button>
                      <button onClick={() => setActiveTab('story')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'story' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                          <Smartphone size={16} /> Story
                      </button>
                      <button onClick={() => setActiveTab('banner')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'banner' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                          <Monitor size={16} /> Banner
                      </button>
                  </div>

                  {/* Canvas Container */}
                  <div className="flex-1 bg-[#e5e5e5] rounded-[2.5rem] border-4 border-white shadow-inner flex items-center justify-center p-8 overflow-hidden relative">
                      {/* Grid Pattern Background */}
                      <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                      
                      <div className={`relative shadow-2xl transition-all duration-500 bg-white ${
                          activeTab === 'feed' ? 'w-[500px] h-[500px]' : 
                          activeTab === 'story' ? 'w-[360px] h-[640px]' : 
                          'w-[800px] h-[450px]'
                      }`}>
                          {strategy && <Compositor asset={assets[activeTab]} context={strategy} />}
                      </div>
                  </div>
              </div>

              {/* Right: Details & Download */}
              <div className="w-full lg:w-80 space-y-6">
                  
                  {/* Action Card */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Export Asset</h3>
                      <button 
                        onClick={() => handleDownload(assets[activeTab].id)}
                        className="w-full py-4 bg-brand-lime text-brand-dark font-black text-lg rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                          <Download size={20} /> Download PNG
                      </button>
                      <p className="text-[10px] text-gray-400 text-center mt-3">Ready for Instagram • 2x Retina Scale</p>
                  </div>

                  {/* Caption Card */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">AI Generated Caption</h3>
                       <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium border border-gray-100">
                           {strategy?.caption}
                       </div>
                       <button className="text-brand-purple text-xs font-bold mt-4 hover:underline flex items-center gap-1">
                           <Wand2 size={12} /> Regenerate Copy
                       </button>
                  </div>

                  {/* Campaign Info */}
                  <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white/10 rounded-lg">
                             <Grid size={16} className="text-brand-lime" />
                          </div>
                          <div>
                              <p className="text-xs text-gray-400">Template</p>
                              <p className="font-bold text-sm">{templates.find(t => t.id === selectedStyle)?.label}</p>
                          </div>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                          <div className="h-full w-3/4 bg-brand-lime"></div>
                      </div>
                      <p className="text-[10px] text-gray-500">Asset bundle generated in 4.2s</p>
                  </div>

              </div>

          </div>
      </div>
  );
};
