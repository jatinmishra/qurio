import { useState } from 'react';
import { toast } from 'sonner';
import { Topic, Question } from './useTopics';
import { TopicProgress } from './useTopicProgress';

export const useQuizLogic = (
  topicProgress: Record<string, TopicProgress>,
  setTopicProgress: React.Dispatch<React.SetStateAction<Record<string, TopicProgress>>>
) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);

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

    const correctlyAnsweredInCurrentLevel = progress.correctlyAnsweredQuestions.filter(id => 
      currentLevelQuestions.some(q => q.id === id)
    ).length;

    // Only advance to next level if ALL questions in current level are answered correctly
    if (completedInCurrentLevel === currentLevelQuestions.length && 
        correctlyAnsweredInCurrentLevel === currentLevelQuestions.length) {
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

  const handleQuizAnswer = (selectedTopic: Topic, isCorrect: boolean) => {
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
      const newCorrectlyAnsweredQuestions = isCorrect 
        ? [...currentProgress.correctlyAnsweredQuestions, currentQuestion.id]
        : currentProgress.correctlyAnsweredQuestions;
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
          correctlyAnsweredQuestions: newCorrectlyAnsweredQuestions,
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

  const handleQuizNext = (selectedTopic: Topic, onComplete: () => void) => {
    if (!selectedTopic) return;
    
    const progress = topicProgress[selectedTopic.id];
    const currentLevelQuestions = selectedTopic.levels[progress?.currentLevel?.toString()]?.questions || [];
    const completedInLevel = progress?.completedQuestions.filter(id => 
      currentLevelQuestions.some(q => q.id === id)
    ).length || 0;

    const correctlyAnsweredInLevel = progress?.correctlyAnsweredQuestions.filter(id => 
      currentLevelQuestions.some(q => q.id === id)
    ).length || 0;

    if (completedInLevel === currentLevelQuestions.length) {
      // All questions in level completed - check if all are correct
      if (correctlyAnsweredInLevel === currentLevelQuestions.length) {
        // All correct - try to advance to next level
        const nextQuestion = getNextQuestion(selectedTopic);
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        } else {
          toast.success("Outstanding! You've mastered this topic!");
          onComplete();
          setCurrentQuestionNumber(1);
        }
      } else {
        // Not all correct - reset level progress to allow retry
        setTopicProgress(prev => ({
          ...prev,
          [selectedTopic.id]: {
            ...prev[selectedTopic.id],
            completedQuestions: prev[selectedTopic.id].completedQuestions.filter(id => 
              !currentLevelQuestions.some(q => q.id === id)
            ),
            correctlyAnsweredQuestions: prev[selectedTopic.id].correctlyAnsweredQuestions.filter(id => 
              !currentLevelQuestions.some(q => q.id === id)
            ),
            isLevelCompleted: false,
            currentLevelQuestionIndex: 0
          }
        }));
        
        toast.info(`You need to answer all ${currentLevelQuestions.length} questions correctly to advance. Starting level over!`);
        onComplete();
        setCurrentQuestionNumber(1);
      }
    } else {
      const nextQuestion = getNextQuestion(selectedTopic);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setCurrentQuestionNumber(prev => Math.min(prev + 1, currentLevelQuestions.length));
      } else {
        onComplete();
        setCurrentQuestionNumber(1);
      }
    }
  };

  return {
    currentQuestion,
    setCurrentQuestion,
    currentQuestionNumber,
    setCurrentQuestionNumber,
    getNextQuestion,
    handleQuizAnswer,
    handleQuizNext
  };
};