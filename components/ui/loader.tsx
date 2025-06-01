import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('loader', sizeClasses[size], className)}>
      <style jsx>{`
        .loader {
          margin: auto;
          position: relative;
        }

        .loader:before {
          content: '';
          width: 100%;
          height: 10%;
          background: rgba(59, 130, 246, 0.3);
          position: absolute;
          top: 125%;
          left: 0;
          border-radius: 50%;
          animation: shadow324 0.5s linear infinite;
        }

        .loader:after {
          content: '';
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 4px;
          animation: jump7456 0.5s linear infinite;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        @keyframes jump7456 {
          15% {
            border-bottom-right-radius: 3px;
          }

          25% {
            transform: translateY(18.75%) rotate(22.5deg);
          }

          50% {
            transform: translateY(37.5%) scale(1, 0.9) rotate(45deg);
            border-bottom-right-radius: 40px;
          }

          75% {
            transform: translateY(18.75%) rotate(67.5deg);
          }

          100% {
            transform: translateY(0) rotate(90deg);
          }
        }

        @keyframes shadow324 {
          0%, 100% {
            transform: scale(1, 1);
          }

          50% {
            transform: scale(1.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

// Full page loader component
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
};

// Inline loader for sections
export const SectionLoader: React.FC<{
  size?: 'sm' | 'md' | 'lg';
}> = ({
  size = 'md'
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader size={size} />
    </div>
  );
};

// Button loader (for loading states in buttons)
export const ButtonLoader: React.FC = () => {
  return <Loader size="sm" className="mr-2" />;
};

export default Loader;
