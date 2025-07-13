
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  completedQuestions: number;
  totalQuestions: number;
  isLocked?: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
}

const TopicCard = ({ 
  title, 
  description, 
  level, 
  maxLevel, 
  completedQuestions, 
  totalQuestions, 
  isLocked = false, 
  icon,
  onClick 
}: TopicCardProps) => {
  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  const cardContent = (
    <div 
      className={`cyber-card group transition-all duration-300 ${
        isLocked 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:scale-105 cursor-pointer'
      }`}
      onClick={!isLocked ? onClick : undefined}
    >
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-gray-500" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Learning Progress</span>
          <span className="text-sm text-primary">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">
            {completedQuestions}/{totalQuestions} questions completed
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Level</span>
            <span className="text-primary font-semibold">{level}</span>
            <span className="text-gray-400">/{maxLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>Complete previous topics to unlock this content</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {cardContent}
      </TooltipTrigger>
      <TooltipContent>
        <p>Click to start learning {title}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TopicCard;
