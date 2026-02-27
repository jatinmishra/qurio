
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Trophy, Cog, RotateCcw, Filter, X, Home, Share2 } from 'lucide-react';
import TopicCard from '@/components/TopicCard';
import Progress from '@/components/Progress';
import TagFilter from '@/components/TagFilter';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useTopics, Topic } from '@/hooks/useTopics';
import { useTopicProgress } from '@/hooks/useTopicProgress';

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { topics, availableTags } = useTopics();
  const { topicProgress, setTopicProgress, resetAllProgress } = useTopicProgress(topics);

  const [mode, setMode] = useState<'topics' | 'progress'>('topics');
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Initialize selectedTags from URL params
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  const setSelectedTags = (tags: string[]) => {
    if (tags.length === 0) {
      searchParams.delete('tags');
    } else {
      searchParams.set('tags', tags.join(','));
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Auto-open filter panel if tags are in URL
  useEffect(() => {
    if (selectedTags.length > 0) {
      setShowTagFilter(true);
    }
  }, []);

  const getFilteredTopics = (): Topic[] => {
    if (selectedTags.length === 0) {
      return topics;
    }

    return topics.filter(topic =>
      topic.tags && topic.tags.some(tag => selectedTags.includes(tag))
    );
  };

  const resetProgress = () => {
    resetAllProgress();
    setMode('topics');
    toast.success("Learning progress has been reset successfully!");
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const handleShareFilters = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const filteredTopics = getFilteredTopics();

  if (mode === 'progress') {
    const allCompletedQuestions = Object.values(topicProgress).reduce(
      (total, progress) => total + progress.completedQuestions.length, 0
    );
    const allCorrectAnswers = Object.values(topicProgress).reduce(
      (total, progress) => total + progress.score, 0
    );

    const progressStats = {
      totalQuestions: allCompletedQuestions,
      correctAnswers: allCorrectAnswers,
      streak: 0,
      level: Object.values(topicProgress).length > 0
        ? Math.max(...Object.values(topicProgress).map(p => p.currentLevel))
        : 1,
      topics: topics.map(topic => {
        const progress = topicProgress[topic.id];
        const currentLevel = progress?.currentLevel || 1;
        const levelQuestions = topic.levels[currentLevel.toString()]?.questions || [];
        const completedInLevel = progress?.completedQuestions.filter(id =>
          levelQuestions.some(q => q.id === id)
        ).length || 0;

        const topicTotalCompleted = progress?.completedQuestions.length || 0;
        const topicCorrectAnswers = progress?.score || 0;
        const accuracy = topicTotalCompleted > 0 ? Math.round((topicCorrectAnswers / topicTotalCompleted) * 100) : 0;

        return {
          id: topic.id,
          name: topic.title,
          completed: completedInLevel,
          total: levelQuestions.length,
          level: currentLevel,
          accuracy: accuracy
        };
      })
    };

    return (
      <Progress
        stats={progressStats}
        onBack={() => setMode('topics')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 rounded bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
            >
              <Home className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-xl font-cyber font-bold text-white">Qurio</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleShareFilters}
                  className="cyber-button px-4 py-2"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy current view link to clipboard</p>
              </TooltipContent>
            </Tooltip>

            <button
              onClick={() => setShowTagFilter(!showTagFilter)}
              className={`cyber-button px-4 py-2 ${selectedTags.length > 0 ? 'border-primary text-primary' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter {selectedTags.length > 0 && `(${selectedTags.length})`}
            </button>

            <button
              onClick={() => setMode('progress')}
              className="cyber-button px-4 py-2"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Progress
            </button>

            <button
              onClick={resetProgress}
              className="cyber-button px-4 py-2 border-orange-500 text-orange-500 hover:bg-orange-500/10"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Tag Filter Panel */}
      {showTagFilter && (
        <div className="border-b border-primary/30 bg-card/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <TagFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {selectedTags.length > 0 && (
        <div className="border-b border-primary/30 bg-card/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-md text-sm"
                >
                  {tag}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="hover:bg-primary/30 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove {tag} filter</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Clear all
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove all active filters</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Learning Path</h2>
          <p className="text-gray-400">
            Select a topic to enhance your knowledge and skills
            {selectedTags.length > 0 && (
              <span className="ml-2 text-primary">
                (Filtered by {selectedTags.length} category{selectedTags.length > 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const progress = topicProgress[topic.id];
            const currentLevel = progress?.currentLevel || 1;
            const currentLevelQuestions = topic.levels[currentLevel.toString()]?.questions || [];
            const completedInLevel = progress?.completedQuestions.filter(id =>
              currentLevelQuestions.some(q => q.id === id)
            ).length || 0;

            return (
              <TopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                description={topic.description}
                level={currentLevel}
                maxLevel={Math.max(...Object.keys(topic.levels).map(l => parseInt(l)))}
                completedQuestions={completedInLevel}
                totalQuestions={currentLevelQuestions.length}
                icon={<Cog className="w-6 h-6 text-primary" />}
                onClick={() => navigate(`/quiz/${topic.id}`)}
              />
            );
          })}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <Cog className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400">Loading topics...</p>
          </div>
        )}

        {filteredTopics.length === 0 && topics.length > 0 && selectedTags.length > 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400">No topics match the selected filters.</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={clearFilters}
                  className="mt-4 cyber-button px-4 py-2"
                >
                  Clear Filters
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove all filters to see all topics</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;