import React from 'react';
import { ViewState, BrandProfile, ModuleId, DesignModule } from '../types';
import { Share2, Type, BadgeCheck, Bus, ArrowRight, LayoutGrid, CheckCircle2 } from 'lucide-react';

interface CommandCenterProps {
  setView: (view: ViewState) => void;
  brand: BrandProfile | null;
  setModule: (mod: ModuleId) => void;
}

// Visual Mockup Components for each module card
const ModulePreview: React.FC<{ type: ModuleId; brandColor: string }> = ({ type, brandColor }) => {
  switch (type) {
    case 'social':
      return (
        <div className="relative w-full h-40 flex items-center justify-center pt-4">
           {/* Phone Mockup */}
           <div className="relative w-28 h-48 bg-gray-900 rounded-[1.5rem] border-4 border-gray-800 shadow-2xl transform rotate-[-6deg] group-hover:rotate-0 transition-all duration-500 ease-out origin-bottom">
              {/* Screen */}
              <div className="absolute inset-1 bg-white rounded-[1.2rem] overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 relative p-3">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
                        <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                     </div>
                  </div>
                  {/* Body */}
                  <div className="p-3 space-y-2">
                     <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                     <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
                     <div className="mt-2 w-full aspect-square bg-gray-50 rounded-lg border border-gray-100"></div>
                  </div>
              </div>
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-gray-900 rounded-b-xl"></div>
           </div>
           
           {/* Floating Bubble */}
           <div className="absolute top-10 right-8 bg-white p-2 rounded-xl shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform delay-75">
              <Share2 size={16} className="text-indigo-500" />
           </div>
        </div>
      );
    case 'print':
      return (
        <div className="relative w-full h-40 flex items-center justify-center">
            {/* Paper Stack */}
            <div className="absolute w-32 h-40 bg-white rounded-lg border border-gray-200 shadow-sm transform rotate-[-3deg] translate-x-2 translate-y-2"></div>
            <div className="relative w-32 h-40 bg-white rounded-lg border border-gray-100 shadow-xl transform rotate-[2deg] group-hover:rotate-0 transition-all duration-500 overflow-hidden flex flex-col">
                <div className="h-24 bg-emerald-50 relative overflow-hidden">
                   <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-100 rounded-full blur-xl"></div>
                   <div className="absolute bottom-4 left-4 w-12 h-12 bg-emerald-500 rounded-full opacity-20"></div>
                </div>
                <div className="p-3 space-y-2">
                    <div className="h-3 w-16 bg-gray-800 rounded mb-2"></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-2/3 bg-gray-200 rounded"></div>
                </div>
            </div>
             <div className="absolute bottom-6 right-12 bg-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg transform translate-x-4">
                A4
            </div>
        </div>
      );
    case 'id_card':
      return (
        <div className="relative w-full h-40 flex items-center justify-center">
            {/* Lanyard String */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-gray-300 transform -translate-y-16"></div>
            
            {/* ID Card */}
            <div className="relative w-48 h-28 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transform rotate-[-2deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 overflow-hidden flex p-3 gap-3">
                {/* Photo Area */}
                <div className="w-16 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                   <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                   </div>
                </div>
                {/* Info Area */}
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 w-full bg-blue-600 rounded-full opacity-20"></div>
                    <div className="h-4 w-24 bg-gray-800 rounded"></div>
                    <div className="h-2 w-16 bg-gray-300 rounded"></div>
                    <div className="mt-auto flex gap-1">
                       <div className="h-1 w-full bg-gray-200"></div>
                       <div className="h-1 w-4 bg-black"></div>
                    </div>
                </div>
                {/* Hole Punch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
        </div>
      );
    case 'campus':
      return (
        <div className="relative w-full h-40 flex items-center justify-center overflow-hidden rounded-t-[2rem]">
            {/* Abstract Bus Side */}
            <div className="absolute inset-x-4 bottom-0 h-28 bg-yellow-400 rounded-t-3xl shadow-lg border-x-2 border-t-2 border-yellow-500 transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                {/* Windows */}
                <div className="flex gap-2 px-4 py-4">
                    <div className="flex-1 h-10 bg-gray-800 rounded-lg opacity-80 backdrop-blur-md"></div>
                    <div className="flex-1 h-10 bg-gray-800 rounded-lg opacity-80 backdrop-blur-md"></div>
                    <div className="flex-1 h-10 bg-gray-800 rounded-lg opacity-80 backdrop-blur-md"></div>
                </div>
                {/* Brand Strip */}
                <div className="mt-2 h-4 bg-black w-full flex items-center px-4 gap-4 overflow-hidden">
                     <div className="w-full h-0.5 bg-yellow-400 dashed"></div>
                </div>
                <div className="absolute bottom-4 left-6 text-yellow-800 font-black text-2xl tracking-tighter opacity-50">SCHOOL BUS</div>
            </div>
            
            {/* Wheel */}
            <div className="absolute bottom-0 left-12 w-12 h-12 bg-gray-900 rounded-full border-4 border-gray-600 shadow-xl transform translate-y-1/2">
               <div className="absolute inset-0 m-auto w-4 h-4 bg-gray-400 rounded-full border-2 border-gray-500"></div>
            </div>
            <div className="absolute bottom-0 right-12 w-12 h-12 bg-gray-900 rounded-full border-4 border-gray-600 shadow-xl transform translate-y-1/2">
               <div className="absolute inset-0 m-auto w-4 h-4 bg-gray-400 rounded-full border-2 border-gray-500"></div>
            </div>
        </div>
      );
    default:
      return null;
  }
};

export const CommandCenter: React.FC<CommandCenterProps> = ({ setView, brand, setModule }) => {
  
  const modules: DesignModule[] = [
    { 
      id: 'social', 
      title: 'Marketing Hub', 
      description: 'Create engaging social media posts, stories, and digital announcements.', 
      iconName: 'Share2',
      color: 'bg-indigo-500' 
    },
    { 
      id: 'print', 
      title: 'Admin Office', 
      description: 'Generate professional flyers, certificates, and official documents.', 
      iconName: 'Type',
      color: 'bg-emerald-500' 
    },
    { 
      id: 'id_card', 
      title: 'Student Services', 
      description: 'Design student IDs, event badges, and staff access passes.', 
      iconName: 'BadgeCheck',
      color: 'bg-blue-500' 
    },
    { 
      id: 'campus', 
      title: 'Campus Brand', 
      description: 'Wrap school buses, design wall murals, and large signage.', 
      iconName: 'Bus',
      color: 'bg-yellow-500' 
    }
  ];

  const handleSelect = (id: ModuleId) => {
    setModule(id);
    setView('studio');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    <LayoutGrid size={16} />
                    <span>Workspace</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Good Morning, <br className="hidden md:block" />
                    <span className="text-brand-purple">{brand?.name || 'Director'}</span>
                </h1>
            </div>
            
            {/* Brand Status Pill */}
            {brand && (
                <div className="flex items-center gap-4 bg-white pl-2 pr-6 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex -space-x-3 group-hover:space-x-1 transition-all">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs text-white font-bold" style={{backgroundColor: brand.colors.primary}}>P</div>
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs text-white font-bold" style={{backgroundColor: brand.colors.secondary}}>S</div>
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs text-brand-dark font-bold" style={{backgroundColor: brand.colors.accent}}>A</div>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Active Brand</span>
                        <span className="block text-sm font-bold text-gray-900">{brand.name}</span>
                    </div>
                    <CheckCircle2 size={16} className="text-green-500 ml-2" />
                </div>
            )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((mod) => (
                <div 
                    key={mod.id}
                    onClick={() => handleSelect(mod.id)}
                    className="group relative bg-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                >
                    {/* Background Gradient Effect */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-transparent to-${mod.color.replace('bg-', '')}/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                    <div className="flex flex-col h-full relative z-10">
                        
                        <div className="flex justify-between items-start mb-8">
                             {/* Icon Box */}
                            <div className={`w-14 h-14 rounded-2xl ${mod.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {mod.id === 'social' && <Share2 size={24} />}
                                {mod.id === 'print' && <Type size={24} />}
                                {mod.id === 'id_card' && <BadgeCheck size={24} />}
                                {mod.id === 'campus' && <Bus size={24} />}
                            </div>
                            
                            {/* Call to Action */}
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-brand-dark group-hover:text-brand-lime transition-all duration-300">
                                <ArrowRight size={20} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">{mod.title}</h3>
                            <p className="text-gray-500 text-lg leading-relaxed max-w-sm">{mod.description}</p>
                        </div>

                        {/* Dynamic Mockup Area */}
                        <div className="mt-auto pt-4 relative min-h-[180px] bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden group-hover:bg-white group-hover:border-gray-200 transition-colors">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ModulePreview type={mod.id} brandColor={brand?.colors.primary || '#000'} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Recent Work Footer */}
        <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Your Recent Designs</h3>
                <button className="text-sm font-semibold text-brand-purple hover:underline">View All History</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-white rounded-2xl shadow-sm border border-gray-100 p-2 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden relative">
                             {/* Placeholder content */}
                             <img src={`https://picsum.photos/seed/${i + 20}/400/500`} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Work" />
                             <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                 <p className="text-xs font-bold text-gray-900">Project {i}</p>
                                 <p className="text-[10px] text-gray-500">Edited 2h ago</p>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
