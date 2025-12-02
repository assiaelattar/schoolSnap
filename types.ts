
export interface BrandProfile {
  name: string;
  logoUrl: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  vibe: string;
  fontPairing: string;
}

export type ViewState = 'landing' | 'onboarding' | 'command-center' | 'studio';

export type ModuleId = 'social' | 'print' | 'id_card' | 'campus';

export interface DesignModule {
  id: ModuleId;
  title: string;
  description: string;
  iconName: 'Share2' | 'Type' | 'BadgeCheck' | 'Bus'; // String ref for Icon component
  color: string;
}

export interface GenerationRequest {
  image: string; // Base64
  prompt: string;
  moduleId: ModuleId;
}

// New Types for Studio Virtual Agency
export type LayoutStyle = 'hero' | 'split' | 'frame';
export type AspectRatio = '1:1' | '9:16' | '16:9';

// PRO TEMPLATES
export type DesignStyle = 'swiss' | 'bold-school' | 'soft-modern' | 'tech-future';

export interface DesignTemplate {
    id: DesignStyle;
    label: string;
    description: string;
    previewColor: string;
}

export type AssetFormat = 'feed' | 'story' | 'banner';

export interface ContactInfo {
  website: string;
  phone: string;
}

// The AI's Strategic Plan
export interface CampaignStrategy {
  headline: string;
  subhead: string;
  cta: string;
  caption: string;
  artDirection: string; // Specific instruction for the image generator
  colorPaletteOverride?: string[]; 
}

// A single generated asset within the campaign
export interface CampaignAsset {
  id: string;
  format: AssetFormat;
  aspectRatio: AspectRatio;
  imageUrl: string | null; // The generated background
  layout: LayoutStyle;
}

export interface CopywritingResponse {
  headline: string;
  subhead: string;
  cta: string;
  caption: string;
  artDirection: string;
}
