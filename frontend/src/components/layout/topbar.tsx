import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

interface TopbarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onCommandOpen: () => void;
}

export function Topbar({ sidebarOpen, onSidebarToggle, onCommandOpen }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between px-6 py-4 h-16">
        {/* Left side */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div className="flex-1 max-w-xs hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                className="pl-9 bg-muted/50"
                onClick={onCommandOpen}
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </Button>

          <ThemeToggle />

          <Button
            variant="outline"
            size="sm"
            onClick={onCommandOpen}
            className="hidden sm:flex gap-2 ml-2 text-muted-foreground"
          >
            <span>⌘K</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
