'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavigationItem } from '@/lib/config/navigation';

interface SidebarProps {
  navigation: NavigationItem[];
  title?: string;
  subtitle?: string;
}

export function Sidebar({ navigation, title = 'SafeTNet', subtitle = 'Admin Panel' }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border flex flex-col py-6 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      {/* Logo Section */}
      <div className="mb-10 px-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="material-icons text-primary flex-shrink-0" style={{ fontSize: '36px' }}>
            security
          </span>
          {isExpanded && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">{title}</span>
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
              )}
            >
              <span className="material-icons-outlined flex-shrink-0">
                {item.icon}
              </span>
              {isExpanded && (
                <span className="text-sm font-medium truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-auto px-4">
        <Link
          href="/settings"
          className={cn(
            'flex items-center space-x-3 p-3 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors rounded-lg'
          )}
        >
          <span className="material-icons-outlined flex-shrink-0">settings</span>
          {isExpanded && (
            <span className="text-sm font-medium">Settings</span>
          )}
        </Link>
      </div>
    </aside>
  );
}
