
import { useState, useEffect } from 'react';
import { Trophy, Target, Cog, Zap, RotateCcw, Filter, X, Github, Home } from 'lucide-react';
import TopicCard from '@/components/TopicCard';
import QuizCard from '@/components/QuizCard';
import Flashcard from '@/components/Flashcard';
import Progress from '@/components/Progress';
import TagFilter from '@/components/TagFilter';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Import existing topic data
import javascriptData from '@/topics/javascript.json';
import reactData from '@/topics/react.json';
import gitData from '@/topics/git.json';
import testingData from '@/topics/testing.json';
import systemDesignData from '@/topics/system-design.json';
import operatingSystemsData from '@/topics/operating-systems.json';
import databaseSystemsData from '@/topics/database-systems.json';
import machineLearningData from '@/topics/machine-learning.json';
import cloudComputingData from '@/topics/cloud-computing.json';
import cybersecurityData from '@/topics/cybersecurity.json';
import softwareArchitectureData from '@/topics/software-architecture.json';

// Import new specific topic data
import reactHooksData from '@/topics/react-hooks.json';
import iosUikitData from '@/topics/ios-uikit.json';
import iosCombineData from '@/topics/ios-combine.json';
import kotlinCoroutinesData from '@/topics/kotlin-coroutines.json';
import dockerContainersData from '@/topics/docker-containers.json';
import kubernetesData from '@/topics/kubernetes.json';
import graphqlData from '@/topics/graphql.json';
import nextjsData from '@/topics/nextjs.json';
import tailwindCssData from '@/topics/tailwindcss.json';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags?: string[];
  author?: {
    username: string;
    github: string;
  };
  levels: Record<string, { questions: Question[] }>;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TopicProgress {
  currentLevel: number;
  completedQuestions: string[];
  score: number;
  totalQuestions: number;
  isLevelCompleted: boolean;
  currentLevelQuestionIndex: number;
}

interface IndexProps {
  onGoToLanding: () => void;
}

const Index = ({ onGoToLanding }: IndexProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [mode, setMode] = useState<'topics' | 'quiz' | 'flashcard' | 'progress'>('topics');
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Validation function for topic structure
  const validateTopic = (topic: any): topic is Topic => {
    if (!topic || typeof topic !== 'object') return false;
    if (!topic.id || !topic.title || !topic.description || !topic.levels) return false;
    if (typeof topic.levels !== 'object') return false;
    
    // Validate each level has questions array
    for (const level of Object.values(topic.levels)) {
      if (!level || typeof level !== 'object' || !Array.isArray((level as any).questions)) {
        return false;
      }
      
      // Validate each question structure
      for (const question of (level as any).questions) {
        if (!question.id || !question.question || !Array.isArray(question.options) || 
            typeof question.correctAnswer !== 'number' || !question.explanation) {
          return false;
        }
      }
    }
    
    return true;
  };

  useEffect(() => {
    // Load topics from imported JSON data (including new specific topics)
    const rawTopics = [
      javascriptData,
      reactData,
      reactHooksData,
      gitData,
      testingData,
      systemDesignData,
      operatingSystemsData,
      databaseSystemsData,
      machineLearningData,
      cloudComputingData,
      cybersecurityData,
      softwareArchitectureData,
      iosUikitData,
      iosCombineData,
      kotlinCoroutinesData,
      dockerContainersData,
      kubernetesData,
      graphqlData,
      nextjsData,
      tailwindCssData
    ];

    // Validate and filter topics
    const loadedTopics: Topic[] = rawTopics.filter((topic, index) => {
      const isValid = validateTopic(topic);
      if (!isValid) {
        console.warn(`Invalid topic structure at index ${index}:`, topic);
        toast.error(`Topic "${topic?.title || 'Unknown'}" has invalid structure and was skipped`);
      }
      return isValid;
    });

    setTopics(loadedTopics);

    // Extract all unique tags from all topics
    const allTags = new Set<string>();
    loadedTopics.forEach(topic => {
      if (topic.tags) {
        topic.tags.forEach(tag => allTags.add(tag));
      }
    });
    setAvailableTags(Array.from(allTags).sort());

    // Load progress from localStorage
    const savedProgress = localStorage.getItem('topicProgress');
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      
      const validatedProgress: Record<string, TopicProgress> = {};
      loadedTopics.forEach(topic => {
        const level1Questions = topic.levels['1']?.questions || [];
        if (parsedProgress[topic.id]) {
          validatedProgress[topic.id] = {
            currentLevel: parsedProgress[topic.id].currentLevel || 1,
            completedQuestions: parsedProgress[topic.id].completedQuestions || [],
            score: parsedProgress[topic.id].score || 0,
            totalQuestions: level1Questions.length,
            isLevelCompleted: parsedProgress[topic.id].isLevelCompleted || false,
            currentLevelQuestionIndex: parsedProgress[topic.id].currentLevelQuestionIndex || 0
          };
        } else {
          validatedProgress[topic.id] = {
            currentLevel: 1,
            completedQuestions: [],
            score: 0,
            totalQuestions: level1Questions.length,
            isLevelCompleted: false,
            currentLevelQuestionIndex: 0
          };
        }
      });
      
      setTopicProgress(validatedProgress);
      localStorage.setItem('topicProgress', JSON.stringify(validatedProgress));
    } else {
      const initialProgress: Record<string, TopicProgress> = {};
      loadedTopics.forEach(topic => {
        const level1Questions = topic.levels['1']?.questions || [];
        initialProgress[topic.id] = {
          currentLevel: 1,
          completedQuestions: [],
          score: 0,
          totalQuestions: level1Questions.length,
          isLevelCompleted: false,
          currentLevelQuestionIndex: 0
        };
      });
      setTopicProgress(initialProgress);
      localStorage.setItem('topicProgress', JSON.stringify(initialProgress));
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (Object.keys(topicProgress).length > 0) {
      localStorage.setItem('topicProgress', JSON.stringify(topicProgress));
    }
  }, [topicProgress]);

  const getFilteredTopics = (): Topic[] => {
    if (selectedTags.length === 0) {
      return topics;
    }
    
    return topics.filter(topic => 
      topic.tags && topic.tags.some(tag => selectedTags.includes(tag))
    );
  };

  const getNextQuestion = (topic: Topic): Question | null => {
    const progress = topicProgress[topic.id];
    if (!progress) {
      const level1Questions = topic.levels['1']?.questions || [];
      return level1Questions[0] || null;
    }

    const currentLevelQuestions = topic.levels[progress.currentLevel.toString()]?.questions || [];
    
    const availableQuestions = currentLevelQuestions.filter(q => 
      !progress.completedQuestions.includes(q.id)
    );

    if (availableQuestions.length > 0) {
      return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }

    const completedInCurrentLevel = progress.completedQuestions.filter(id => 
      currentLevelQuestions.some(q => q.id === id)
    ).length;

    if (completedInCurrentLevel === currentLevelQuestions.length) {
      const nextLevel = progress.currentLevel + 1;
      const nextLevelQuestions = topic.levels[nextLevel.toString()]?.questions || [];
      
      if (nextLevelQuestions.length > 0) {
        setTopicProgress(prev => ({
          ...prev,
          [topic.id]: {
            ...prev[topic.id],
            currentLevel: nextLevel,
            isLevelCompleted: false,
            totalQuestions: nextLevelQuestions.length,
            currentLevelQuestionIndex: 0
          }
        }));
        
        toast.success(`Congratulations! Advanced to Level ${nextLevel}!`);
        setCurrentQuestionNumber(1);
        return nextLevelQuestions[0];
      }
    }

    return null;
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (!selectedTopic || !currentQuestion) return;
    
    setTopicProgress(prev => {
      const topicId = selectedTopic.id;
      const currentProgress = prev[topicId];
      
      if (!currentProgress) {
        console.error(`No progress found for topic: ${topicId}`);
        return prev;
      }
      
      if (currentProgress.completedQuestions.includes(currentQuestion.id)) {
        return prev;
      }
      
      const newCompletedQuestions = [...currentProgress.completedQuestions, currentQuestion.id];
      const newScore = isCorrect ? currentProgress.score + 1 : currentProgress.score;
      
      const currentLevelQuestions = selectedTopic.levels[currentProgress.currentLevel.toString()]?.questions || [];
      const completedInLevel = newCompletedQuestions.filter(id => 
        currentLevelQuestions.some(q => q.id === id)
      ).length;
      
      const isLevelCompleted = completedInLevel === currentLevelQuestions.length;
      
      console.log(`Topic: ${topicId}, Completed: ${newCompletedQuestions.length}, Correct: ${newScore}`);
      
      return {
        ...prev,
        [topicId]: {
          ...currentProgress,
          completedQuestions: newCompletedQuestions,
          score: newScore,
          isLevelCompleted,
          currentLevelQuestionIndex: completedInLevel
        }
      };
    });
    
    if (isCorrect) {
      toast.success("Excellent! You've got this right!");
    } else {
      toast.error("Not quite right. Review and try again!");
    }
  };

  const handleQuizNext = () => {
    if (!selectedTopic) return;
    
    const progress = topicProgress[selectedTopic.id];
    const currentLevelQuestions = selectedTopic.levels[progress?.currentLevel?.toString()]?.questions || [];
    const completedInLevel = progress?.completedQuestions.filter(id => 
      currentLevelQuestions.some(q => q.id === id)
    ).length || 0;

    if (completedInLevel === currentLevelQuestions.length) {
      const nextQuestion = getNextQuestion(selectedTopic);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      } else {
        toast.success("Outstanding! You've mastered this topic!");
        setMode('topics');
        setCurrentQuestionNumber(1);
      }
    } else {
      const nextQuestion = getNextQuestion(selectedTopic);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setCurrentQuestionNumber(prev => Math.min(prev + 1, currentLevelQuestions.length));
      } else {
        setMode('topics');
        setCurrentQuestionNumber(1);
      }
    }
  };

  const handleFlashcardNext = () => {
    if (!selectedTopic) return;
    
    const nextQuestion = getNextQuestion(selectedTopic);
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      setMode('topics');
    }
  };

  const resetProgress = () => {
    localStorage.removeItem('topicProgress');
    
    const initialProgress: Record<string, TopicProgress> = {};
    topics.forEach(topic => {
      const level1Questions = topic.levels['1']?.questions || [];
      initialProgress[topic.id] = {
        currentLevel: 1,
        completedQuestions: [],
        score: 0,
        totalQuestions: level1Questions.length,
        isLevelCompleted: false,
        currentLevelQuestionIndex: 0
      };
    });
    
    setTopicProgress(initialProgress);
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
            onAnswer={handleQuizAnswer}
            onNext={handleQuizNext}
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

  if (mode === 'flashcard' && selectedTopic && currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Flashcard
          question={currentQuestion}
          onNext={handleFlashcardNext}
          onPrevious={() => {}}
          onBack={() => setMode('topics')}
          cardNumber={1}
          totalCards={selectedTopic.levels[topicProgress[selectedTopic.id]?.currentLevel?.toString()]?.questions?.length || 0}
          canGoNext={true}
          canGoPrevious={false}
        />
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
                  setMode('quiz');
                  
                  setCurrentQuestionNumber(1);
                  
                  const question = getNextQuestion(topic);
                  if (question) {
                    setCurrentQuestion(question);
                  } else {
                    toast.success("Outstanding! You've mastered all available concepts for this topic!");
                    setMode('topics');
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
    </div>
  );
};

export default Index;
