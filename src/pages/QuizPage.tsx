
import { useParams, useNavigate } from 'react-router-dom';
import { Github, Share2, ArrowLeft } from 'lucide-react';
import QuizCard from '@/components/QuizCard';
import { useTopics, Topic } from '@/hooks/useTopics';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const QuizPage = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const { topics } = useTopics();
    const { topicProgress, setTopicProgress } = useTopicProgress(topics);
    const {
        currentQuestion,
        setCurrentQuestion,
        currentQuestionNumber,
        setCurrentQuestionNumber,
        getNextQuestion,
        handleQuizAnswer,
        handleQuizNext
    } = useQuizLogic(topicProgress, setTopicProgress);

    const [showResetDialog, setShowResetDialog] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const selectedTopic: Topic | undefined = topics.find(t => t.id === topicId);

    // Initialize quiz when topic and progress are ready
    useEffect(() => {
        if (selectedTopic && Object.keys(topicProgress).length > 0 && !initialized) {
            const question = getNextQuestion(selectedTopic);
            if (question) {
                setCurrentQuestion(question);
                setCurrentQuestionNumber(1);
            } else {
                // All levels completed — show reset dialog
                setShowResetDialog(true);
            }
            setInitialized(true);
        }
    }, [selectedTopic, topicProgress, initialized]);

    const handleShareQuiz = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Quiz link copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy link');
        });
    };

    // Topics haven't loaded yet
    if (topics.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    // Topic not found
    if (!selectedTopic) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <p className="text-gray-400 text-lg">Topic not found: <code className="text-primary">{topicId}</code></p>
                <button
                    onClick={() => navigate('/topics')}
                    className="cyber-button px-6 py-3"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Browse Topics
                </button>
            </div>
        );
    }

    // Quiz active
    if (currentQuestion) {
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
                        onNext={() => handleQuizNext(selectedTopic, () => navigate('/topics'))}
                        onBack={() => navigate('/topics')}
                        questionNumber={currentQuestionNumber}
                        totalQuestions={totalQuestions}
                        shareButton={
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleShareQuiz}
                                        className="text-gray-400 hover:text-primary transition-colors p-1"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy quiz link</p>
                                </TooltipContent>
                            </Tooltip>
                        }
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

    // Waiting for initialization
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-gray-400">Loading quiz...</p>

            <ConfirmationDialog
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
                title="Quiz Complete!"
                description={`You've completed all levels for this topic!\n\nDo you want to start over? This will reset all your progress for this topic.`}
                confirmText="Reset Progress"
                cancelText="Go Back"
                onConfirm={() => {
                    setTopicProgress(prev => ({
                        ...prev,
                        [selectedTopic.id]: {
                            completedQuestions: [],
                            correctlyAnsweredQuestions: [],
                            currentLevel: 1,
                            score: 0,
                            totalQuestions: selectedTopic.levels['1']?.questions?.length || 0,
                            isLevelCompleted: false,
                            currentLevelQuestionIndex: 0
                        }
                    }));
                    setInitialized(false);
                    toast.success("Progress reset! Starting from level 1.");
                }}
                onCancel={() => {
                    navigate('/topics');
                }}
            />
        </div>
    );
};

export default QuizPage;
