
import { useState } from 'react';
import { Trophy, Cog, RotateCcw, Filter, X, Github, Home } from 'lucide-react';
import TopicCard from '@/components/TopicCard';
import QuizCard from '@/components/QuizCard';
import Progress from '@/components/Progress';
import TagFilter from '@/components/TagFilter';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useTopics, Topic } from '@/hooks/useTopics';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useQuizLogic } from '@/hooks/useQuizLogic';

interface IndexProps {
  onGoToLanding: () => void;
}

const Index = ({ onGoToLanding }: IndexProps) => {
  const { topics, availableTags } = useTopics();
  const { topicProgress, setTopicProgress, resetAllProgress } = useTopicProgress(topics);
  const {
    currentQuestion,
    setCurrentQuestion,
    currentQuestionNumber,
    setCurrentQuestionNumber,
    getNextQuestion,
    handleQuizAnswer,
    handleQuizNext
  } = useQuizLogic(topicProgress, setTopicProgress);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [mode, setMode] = useState<'topics' | 'quiz' | 'progress'>('topics');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [topicToReset, setTopicToReset] = useState<Topic | null>(null);

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
    setSelectedTopic(null);
    setCurrentQuestion(null);
    setCurrentQuestionNumber(1);
    setMode('topics');
    
    toast.success("Learning progress has been reset successfully!");
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const filteredTopics = getFilteredTopics();

  if (mode === 'quiz' && selectedTopic && currentQuestion) {
    const progress = topicProgress[selectedTopic.id];
    const totalQuestions = selectedTopic.levels[progress?.currentLevel?.toString()]?.questions?.length || 0;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <QuizCard
            question={{
              id: currentQuestion.id,
              question: currentQuestion.question,
              options: currentQuestion.options,
              correctAnswer: currentQuestion.correctAnswer,
              explanation: currentQuestion.explanation
            }}
            onAnswer={(isCorrect) => handleQuizAnswer(selectedTopic, isCorrect)}
            onNext={() => handleQuizNext(selectedTopic, () => setMode('topics'))}
            onBack={() => {
              setMode('topics');
              setCurrentQuestionNumber(1);
            }}
            questionNumber={currentQuestionNumber}
            totalQuestions={totalQuestions}
          />
        </div>
        
        {selectedTopic.author && (
          <div className="border-t border-primary/30 bg-card/50 backdrop-blur-sm p-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>Quiz created by</span>
                <a
                  href={selectedTopic.author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  {selectedTopic.author.username}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  if (mode === 'progress') {
    const allCompletedQuestions = Object.values(topicProgress).reduce(
      (total, progress) => total + progress.completedQuestions.length, 0
    );
    const allCorrectAnswers = Object.values(topicProgress).reduce(
      (total, progress) => total + progress.score, 0
    );

    console.log(`Total completed: ${allCompletedQuestions}, Total correct: ${allCorrectAnswers}`);

    const progressStats = {
      totalQuestions: allCompletedQuestions,
      correctAnswers: allCorrectAnswers,
      streak: 0,
      level: Math.max(...Object.values(topicProgress).map(p => p.currentLevel)),
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
        
        console.log(`Topic ${topic.title}: completed=${topicTotalCompleted}, correct=${topicCorrectAnswers}, accuracy=${accuracy}%`);
        
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
              onClick={onGoToLanding}
              className="w-8 h-8 rounded bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
            >
              <Home className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-xl font-cyber font-bold text-white">Qurio</h1>
          </div>
          
          <div className="flex items-center space-x-4">
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
                onClick={() => {
                  setSelectedTopic(topic);
                  const question = getNextQuestion(topic);
                  if (question) {
                    setCurrentQuestion(question);
                    setMode('quiz');
                    setCurrentQuestionNumber(1);
                  } else {
                    // All levels completed - show custom dialog
                    setTopicToReset(topic);
                    setShowResetDialog(true);
                  }
                }}
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
      
      <ConfirmationDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Quiz Complete!"
        description={`You've completed all levels for this topic!\n\nDo you want to start over? This will reset all your progress for this topic.`}
        confirmText="Reset Progress"
        cancelText="Cancel"
        onConfirm={() => {
          if (topicToReset) {
            // Reset progress for this topic
            setTopicProgress(prev => ({
              ...prev,
              [topicToReset.id]: {
                completedQuestions: [],
                correctlyAnsweredQuestions: [],
                currentLevel: 1,
                score: 0,
                totalQuestions: topicToReset.levels['1']?.questions?.length || 0,
                isLevelCompleted: false,
                currentLevelQuestionIndex: 0
              }
            }));
            
            // Start the quiz from the beginning
            const firstQuestionAfterReset = getNextQuestion(topicToReset);
            if (firstQuestionAfterReset) {
              setCurrentQuestion(firstQuestionAfterReset);
              setMode('quiz');
              setCurrentQuestionNumber(1);
              toast.success("Progress reset! Starting from level 1.");
            }
            setTopicToReset(null);
          }
        }}
        onCancel={() => {
          setTopicToReset(null);
        }}
      />
    </div>
  );
};

export default Index;