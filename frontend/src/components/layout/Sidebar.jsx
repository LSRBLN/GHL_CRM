import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  CalendarDays,
  Users,
  TrendingUp,
  CreditCard,
  Mail,
  Zap,
  Globe,
  Award,
  FolderOpen,
  Star,
  BarChart3,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  Crosshair,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Crosshair, label: 'Ausschau halten', path: '/prospecting' },
  { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
  { icon: CalendarDays, label: 'Calendars', path: '/calendars' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: TrendingUp, label: 'Opportunities', path: '/opportunities' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Mail, label: 'Marketing', path: '/marketing' },
  { icon: Zap, label: 'Automation', path: '/automation' },
  { icon: Globe, label: 'Sites', path: '/sites' },
  { icon: Award, label: 'Memberships', path: '/memberships' },
  { icon: FolderOpen, label: 'Media Storage', path: '/media' },
  { icon: Star, label: 'Reputation', path: '/reputation' },
  { icon: BarChart3, label: 'Reporting', path: '/reporting' },
  { icon: Store, label: 'App Marketplace', path: '/marketplace' },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={`fixed left-0 top-0 h-full bg-[#111827] flex flex-col z-50 transition-all duration-200 ease-in-out ${
          expanded ? 'w-[220px]' : 'w-[60px]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-[56px] px-3 border-b border-gray-800">
          <div className="flex items-center gap-2 min-w-[36px] justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">HL</span>
            </div>
            {expanded && (
              <span className="text-white font-semibold text-sm whitespace-nowrap overflow-hidden">
                HighLevel
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            const button = (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 mx-auto relative group transition-colors duration-150 ${
                  active
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />
                )}
                <div className="min-w-[36px] flex items-center justify-center">
                  <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                </div>
                {expanded && (
                  <span className="text-[13px] font-medium whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </button>
            );

            if (!expanded) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700 text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate('/settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 ${
                  isActive('/settings')
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="min-w-[36px] flex items-center justify-center">
                  <Settings size={20} strokeWidth={1.5} />
                </div>
                {expanded && (
                  <span className="text-[13px] font-medium whitespace-nowrap">Settings</span>
                )}
              </button>
            </TooltipTrigger>
            {!expanded && (
              <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700 text-xs">
                Settings
              </TooltipContent>
            )}
          </Tooltip>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-300 transition-colors duration-150"
          >
            <div className="min-w-[36px] flex items-center justify-center">
              {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </div>
            {expanded && (
              <span className="text-[12px] whitespace-nowrap">Einklappen</span>
            )}
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
