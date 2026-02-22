import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Building2,
  X,
} from 'lucide-react';
import { currentUser, notifications } from '../../data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';

const Header = ({ sidebarExpanded }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`fixed top-0 right-0 h-[56px] bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 transition-all duration-200 ${
        sidebarExpanded ? 'left-[220px]' : 'left-[60px]'
      }`}
    >
      {/* Left - Location Selector */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <Building2 size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {currentUser.location}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 font-medium uppercase">Standorte</p>
            </div>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Building2 size={14} />
              <span>PHNX Vision Agency</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-blue-600 cursor-pointer">
              + Neuen Standort hinzufügen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-auto">
        {searchOpen ? (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-9 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              autoFocus
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm w-full max-w-sm mx-auto transition-colors"
          >
            <Search size={15} />
            <span>Suchen...</span>
            <kbd className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-1">
        {/* Help */}
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <HelpCircle size={18} />
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold">Benachrichtigungen</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <p className={`text-sm font-medium ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 ml-auto flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{notif.message}</p>
                  <p className="text-[11px] text-gray-400">{notif.time}</p>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 text-sm justify-center cursor-pointer">
              Alle Benachrichtigungen anzeigen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                {currentUser.initials}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Mein Profil</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Einstellungen</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Agentur-Ansicht</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer">Abmelden</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
