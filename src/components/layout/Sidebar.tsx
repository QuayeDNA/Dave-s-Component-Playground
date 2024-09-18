// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  Menu,
  MapIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev =>
      prev.includes(menu)
        ? prev.filter(item => item !== menu)
        : [...prev, menu]
    );
  };

  const menuItems = [
    { name: 'Overview', path: '/overview', icon: Home },
    {
      name: 'Components',
      icon: Menu,
      subItems: [
        { name: 'Buttons', path: '/components/buttons' },
        { name: 'Forms', path: '/components/forms' },
        { name: 'Cards', path: '/components/cards' },
      ], 
    },
    { name: 'Zones Management', path: '/zones', icon: MapIcon}
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-[90] w-64 bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-lg transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-blue-400">Component Playground</h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
      </div>
      <nav className="mt-5 px-2">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="flex items-center w-full p-2 text-gray-300 hover:bg-gray-700 rounded-md"
                  >
                    <item.icon className="mr-2" size={20} />
                    {item.name}
                    {openMenus.includes(item.name) ? (
                      <ChevronDown className="ml-auto" size={20} />
                    ) : (
                      <ChevronRight className="ml-auto" size={20} />
                    )}
                  </button>
                  {openMenus.includes(item.name) && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            className="block p-2 text-sm text-gray-400 hover:bg-gray-700 rounded-md"
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <item.icon className="mr-2" size={20} />
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};