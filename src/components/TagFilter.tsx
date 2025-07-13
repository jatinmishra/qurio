
import { Tag } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

const TagFilter = ({ availableTags, selectedTags, onTagToggle, onClearFilters }: TagFilterProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-white">Filter by tags</h3>
        </div>
        {selectedTags.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onClearFilters}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear all
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove all selected filters</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <Tooltip key={tag}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-black font-medium'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                {tag}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {selectedTags.includes(tag) ? 'Remove' : 'Add'} {tag} specialization filter
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      {availableTags.length === 0 && (
        <p className="text-xs text-gray-500">No specializations available</p>
      )}
    </div>
  );
};

export default TagFilter;
