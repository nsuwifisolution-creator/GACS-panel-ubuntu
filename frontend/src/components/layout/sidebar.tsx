import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cpu,
  ClipboardList,
  Zap,
  Package,
  Users,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Devices', href: '/devices', icon: Cpu },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList },
  { name: 'Presets', href: '/presets', icon: Zap },
  { name: 'Firmware', href: '/firmware', icon: Package },
  { name: 'Users', href: '/users', icon: Users },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">GA</span>
          </div>
          <span className="font-semibold text-lg hidden md:block">GenieACS</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <motion.div key={item.href} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-4">
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">{user?.username}</p>
          <p className="capitalize">{user?.role}</p>
        </div>
        <Link
          to="/settings"
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
