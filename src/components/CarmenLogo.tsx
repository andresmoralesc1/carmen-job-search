/**
 * Carmen Job Search Logo Component
 * Uses the official brain/neural network logo
 */

export function CarmenLogo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizes = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <img
      src="https://andresmorales.com.co/wp-content/uploads/2026/01/Gemini_Generated_Image_ajinweajinweajin-removebg-preview.png"
      alt="Carmen Job Search"
      className={`${sizes[size]} ${className}`}
      style={{ borderRadius: '8px' }}
    />
  );
}

export function CarmenLogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CarmenLogo size="default" />
      <span className="text-xl font-bold text-white">Carmen Job Search</span>
    </div>
  );
}
