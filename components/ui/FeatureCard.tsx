import React, { useRef, useState } from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
  icon: LucideIcon;
  delay?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, image, onClick, icon: Icon, delay = '0s' }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative h-[450px] w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-lamar-blue"
      style={{ animationDelay: delay }}
    >
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lamar-navy/95 via-lamar-navy/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Glass Overlay Effect (Magnetic Follow) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-left transform transition-transform duration-500 group-hover:-translate-y-2">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-lamar-gold border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
          <Icon size={28} />
        </div>
        
        <h3 className="text-3xl font-heading font-bold text-white mb-3 tracking-tight group-hover:text-lamar-blue transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-300 mb-8 line-clamp-2 text-lg transform transition-all duration-500 group-hover:text-white/90">
          {description}
        </p>

        <span className="inline-flex items-center text-sm font-bold text-white bg-white/10 backdrop-blur-md px-6 py-3 rounded-full transition-all duration-300 group-hover:bg-lamar-blue group-hover:text-white group-hover:shadow-glow">
          Explore <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-500" />
    </button>
  );
};
