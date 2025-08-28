import React, { useEffect, useState } from 'react';

const SuccessModal = ({ isOpen, onClose, title, message, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
            isVisible 
              ? 'scale-100 opacity-100' 
              : 'scale-95 opacity-0'
          } w-full max-w-md`}
        >
          {/* Success Icon Background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 opacity-10"></div>
          
          {/* Content */}
          <div className="relative px-6 py-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <svg 
                  className="h-8 w-8 text-white animate-bounce" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-4 text-2xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h3>

            {/* Message */}
            <p className="mb-8 text-slate-600 leading-relaxed">
              {message}
            </p>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-emerald-400 opacity-60 animate-pulse"></div>
            <div className="absolute top-6 right-6 h-1 w-1 rounded-full bg-cyan-400 opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-8 left-6 h-1.5 w-1.5 rounded-full bg-blue-400 opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Action Button */}
            <button
              onClick={handleConfirm}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span>Tiếp tục</span>
                <svg 
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;

