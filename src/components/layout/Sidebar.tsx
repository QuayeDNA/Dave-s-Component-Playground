import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  Menu,
  MapIcon,
} from "lucide-react";
import { CubeIcon } from "@radix-ui/react-icons";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menu: string) => {
    if (!isOpen) {
      setActiveSubmenu(activeSubmenu === menu ? null : menu);
    } else {
      setOpenMenus((prev) =>
        prev.includes(menu)
          ? prev.filter((item) => item !== menu)
          : [...prev, menu]
      );
    }
  };

  const menuItems = [
    { name: "Overview", path: "/overview", icon: Home },
    {
      name: "Components",
      icon: Menu,
      subItems: [
        { name: "Buttons", path: "/components/buttons" },
        { name: "Forms", path: "/components/forms" },
        { name: "Cards", path: "/components/cards" },
      ],
    },
    { name: "Zones Management", path: "/zones", icon: MapIcon },
    {
      name: "Animations",
      icon: CubeIcon,
      subItems: [
        { name: "2D Animations", path: "/animations/2d" },
        { name: "3D Animations", path: "/animations/3d" },
        { name: "Physics", path: "/animations/physics" },
        { name: "Tween", path: "/animations/tween" },
        { name: "Interactive", path: "/animations/interactive" },
        { name: "Morph", path: "/animations/morph" },
      ],
    },
    {
      name: "3D Interactive",
      icon: CubeIcon,
      subItems: [
        { name: "Basics", path: "/3d-interactive" },
        { name: "Torus", path: "/3d-interactive/torus" },
      ],
    },
    { name: "Sticky Notes", path: "/sticky-notes", icon: Menu },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-[90] bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out lg:relative",
        isOpen ? "w-64" : "w-20",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen ? (
          <h2 className="text-xl font-semibold text-blue-400">
            Component Playground
          </h2>
        ) : (
          <div className="w-full flex justify-center">
            <img src="/vite.svg" alt="React Icon" className="w-8 h-8" />
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white lg:hidden">
          <ChevronLeft size={24} className={cn("transform transition-transform", !isOpen && "rotate-180")} />
        </button>
      </div>
      <nav className="mt-5 px-2">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index} className="relative">
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn("flex items-center w-full p-2 text-gray-300 hover:bg-gray-700 rounded-md",
                      !isOpen && "justify-center")}>
                    <item.icon className={cn("mr-2", !isOpen && "mr-0")} size={20} />
                    {isOpen && (
                      <>
                        <span>{item.name}</span>
                        {openMenus.includes(item.name) ? (
                          <ChevronDown className="ml-auto" size={20} />
                        ) : (
                          <ChevronRight className="ml-auto" size={20} />
                        )}
                      </>
                    )}
                  </button>
                  {isOpen && openMenus.includes(item.name) && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            className={cn("block p-2 text-sm text-gray-400 hover:bg-gray-700 rounded-md",
                              location.pathname === subItem.path && "bg-gray-700 text-white")}>
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isOpen && activeSubmenu === item.name && (
                    <div ref={submenuRef} className="absolute left-full top-0 w-48 bg-gray-800 rounded-md shadow-lg p-2 ml-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={cn("block p-2 text-sm text-gray-400 hover:bg-gray-700 rounded-md",
                            location.pathname === subItem.path && "bg-gray-700 text-white")}
                          onClick={() => setActiveSubmenu(null)}>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn("flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-md",
                    !isOpen && "justify-center",
                    location.pathname === item.path && "bg-gray-700 text-white")}>
                  <item.icon className={cn("mr-2", !isOpen && "mr-0")} size={20} />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};