
import { Monitor, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const themes = [
  { id: 'matrix' as Theme, name: 'Matrix', icon: Monitor, color: '#00ff41' },
  { id: 'tron' as Theme, name: 'Tron', icon: Zap, color: '#00d4ff' }
];

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsExpanded(false); // Close after selection
  };

  return (
    <div className="fixed top-4 right-4 z-50" ref={containerRef}>
      <div className="cyber-card p-3 bg-background/90 backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-foreground hover:text-primary transition-colors min-w-[80px]"
            >
              <span className="text-sm font-semibold">Theme</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose your preferred visual theme</p>
          </TooltipContent>
        </Tooltip>
        
        {isExpanded && (
          <div className="mt-3 grid grid-cols-2 gap-2 animate-fade-in w-48">
            {themes.map(({ id, name, icon: Icon, color }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleThemeSelect(id)}
                    className={`relative group p-3 rounded-lg border transition-all duration-300 ${
                      theme === id 
                        ? 'border-primary bg-primary/20 scale-105' 
                        : 'border-border hover:border-primary/50 hover:bg-primary/10'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Icon 
                        className="w-4 h-4 transition-colors duration-300" 
                        style={{ color: theme === id ? color : undefined }}
                      />
                      <span className={`text-xs transition-colors duration-300 ${
                        theme === id ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {name}
                      </span>
                    </div>
                    {theme === id && (
                      <div 
                        className="absolute inset-0 rounded-lg opacity-20 animate-pulse"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {name} theme</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
