import React from 'react';
import { Sun, Waves } from 'lucide-react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 px-4 border-t border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-4">
          {/* Decorative Elements */}
          <div className="flex items-center space-x-4 text-xl">
            <span role="img" aria-label="Palm Tree">🌴</span>
            <Waves className="w-4 h-4 text-slate-400" />
            <span role="img" aria-label="Palm Tree">🌴</span>
          </div>

          {/* Personal Message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600 font-medium">
              Built with much love for my brother, Bristean Luzey.
            </p>
            <p className="text-xs text-slate-500">
              - Fidel Fúnez C.
            </p>
          </div>

          {/* Sun Decoration */}
          <div className="flex items-center space-x-2">
            <Sun className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-slate-500">Caribbean Lux Realty</span>
            <Sun className="w-3 h-3 text-yellow-500 fill-current" />
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              © {currentYear} Caribbean Lux Realty. All rights reserved.
            </p>
          </div>

          {/* Bottom Decorative Line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter; 