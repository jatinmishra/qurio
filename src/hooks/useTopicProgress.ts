import { useState, useEffect } from 'react';
import { Topic } from './useTopics';

export interface TopicProgress {
  currentLevel: number;
  completedQuestions: string[];
  correctlyAnsweredQuestions: string[];
  score: number;
  totalQuestions: number;
  isLevelCompleted: boolean;
  currentLevelQuestionIndex: number;
}

export const useTopicProgress = (topics: Topic[]) => {
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({});

  // Initialize progress
  useEffect(() => {
    if (topics.length === 0) return;

    const savedProgress = localStorage.getItem('topicProgress');
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      
      const validatedProgress: Record<string, TopicProgress> = {};
      topics.forEach(topic => {
        const level1Questions = topic.levels['1']?.questions || [];
        if (parsedProgress[topic.id]) {
          validatedProgress[topic.id] = {
            currentLevel: parsedProgress[topic.id].currentLevel || 1,
            completedQuestions: parsedProgress[topic.id].completedQuestions || [],
            correctlyAnsweredQuestions: parsedProgress[topic.id].correctlyAnsweredQuestions || [],
            score: parsedProgress[topic.id].score || 0,
            totalQuestions: level1Questions.length,
            isLevelCompleted: parsedProgress[topic.id].isLevelCompleted || false,
            currentLevelQuestionIndex: parsedProgress[topic.id].currentLevelQuestionIndex || 0
          };
        } else {
          validatedProgress[topic.id] = {
            currentLevel: 1,
            completedQuestions: [],
            correctlyAnsweredQuestions: [],
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
      topics.forEach(topic => {
        const level1Questions = topic.levels['1']?.questions || [];
        initialProgress[topic.id] = {
          currentLevel: 1,
          completedQuestions: [],
          correctlyAnsweredQuestions: [],
          score: 0,
          totalQuestions: level1Questions.length,
          isLevelCompleted: false,
          currentLevelQuestionIndex: 0
        };
      });
      setTopicProgress(initialProgress);
      localStorage.setItem('topicProgress', JSON.stringify(initialProgress));
    }
  }, [topics]);

  // Save progress whenever it changes
  useEffect(() => {
    if (Object.keys(topicProgress).length > 0) {
      localStorage.setItem('topicProgress', JSON.stringify(topicProgress));
    }
  }, [topicProgress]);

  const resetAllProgress = () => {
    localStorage.removeItem('topicProgress');
    
    const initialProgress: Record<string, TopicProgress> = {};
    topics.forEach(topic => {
      const level1Questions = topic.levels['1']?.questions || [];
      initialProgress[topic.id] = {
        currentLevel: 1,
        completedQuestions: [],
        correctlyAnsweredQuestions: [],
        score: 0,
        totalQuestions: level1Questions.length,
        isLevelCompleted: false,
        currentLevelQuestionIndex: 0
      };
    });
    
    setTopicProgress(initialProgress);
  };

  return { topicProgress, setTopicProgress, resetAllProgress };
};