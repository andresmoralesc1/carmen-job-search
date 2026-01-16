// Images for Carmen Job Search
// Using Unsplash Source API for reliable image serving
// License: Unsplash License (free to use)

export const images = {
  // Hero / Landing Page
  hero: {
    jobSearch: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=800&fit=crop",
    womanSearching: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop",
    hiring: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop",
  },

  // Workspace / Office Images
  workspace: {
    minimalist: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&h=800&fit=crop",
    modernOffice: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
    openOffice: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop",
    homeOffice: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&h=800&fit=crop",
    stylishDesk: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=800&fit=crop",
  },

  // People / Job Search Related
  people: {
    phoneCall: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=800&fit=crop",
    newspaper: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&h=800&fit=crop",
    computer: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop",
    reading: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
  },

  // AI / Tech Images
  ai: {
    neural: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    code: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop",
    data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  },

  // Backgrounds
  backgrounds: {
    gradient: "linear-gradient(to bottom right, #000, #18181b)",
    darkGradient: "linear-gradient(135deg, #000000 0%, #18181b 50%, #27272a 100%)",
  },
};

export const imageAttribution = "Photos by Unsplash";

// Helper function for image with fallback
export function getImageWithFallback(primary: string, fallback: string): string {
  return primary || fallback;
}
