import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  action: () => void;
}

const commands: CommandItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    category: 'Navigation',
    action: () => {},
  },
  {
    id: 'devices',
    label: 'Devices',
    category: 'Navigation',
    action: () => {},
  },
  {
    id: 'tasks',
    label: 'Tasks',
    category: 'Navigation',
    action: () => {},
  },
  {
    id: 'presets',
    label: 'Presets',
    category: 'Navigation',
    action: () => {},
  },
  {
    id: 'firmware',
    label: 'Firmware',
    category: 'Navigation',
    action: () => {},
  },
  {
    id: 'settings',
    label: 'Settings',
    category: 'Navigation',
    action: () => {},
  },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce(
    (acc, cmd) => {
      const group = acc.find((g) => g.category === cmd.category);
      if (group) {
        group.items.push(cmd);
      } else {
        acc.push({ category: cmd.category, items: [cmd] });
      }
      return acc;
    },
    [] as { category: string; items: CommandItem[] }[]
  );

  const handleSelect = (cmd: CommandItem) => {
    const path = '/' + cmd.id;
    navigate(path);
    onOpenChange(false);
    setSearch('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      } else if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, selectedIndex, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="rounded-lg border border-border bg-card shadow-xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  autoFocus
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="border-0 bg-transparent placeholder:text-muted-foreground"
                />
              </div>

              {/* Commands list */}
              <div className="max-h-64 overflow-y-auto">
                {grouped.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No commands found.
                  </div>
                ) : (
                  grouped.map((group) => (
                    <div key={group.category}>
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground text-sm-label">
                        {group.category}
                      </div>
                      {group.items.map((item, idx) => {
                        const globalIndex = filtered.findIndex((cmd) => cmd.id === item.id);
                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className={cn(
                              'w-full flex items-center justify-between px-4 py-2 text-sm transition-colors',
                              globalIndex === selectedIndex
                                ? 'bg-primary/10 text-primary'
                                : 'text-foreground hover:bg-muted/50'
                            )}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>{item.label}</span>
                            {globalIndex === selectedIndex && <ArrowRight className="w-4 h-4" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground bg-muted/50">
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 rounded bg-background border border-border text-xs">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 rounded bg-background border border-border text-xs">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
