// src/components/layout/Header.tsx
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="w-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-300 hover:text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="flex items-center">
            {/* Add user menu or other header items here */}
          </div>
        </div>
      </div>
    </header>
  );
};