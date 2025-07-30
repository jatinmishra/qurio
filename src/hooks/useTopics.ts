import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const topicModules = import.meta.glob('@/topics/*.json', { eager: true });

export interface Topic {
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

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

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

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    // Load topics dynamically from all JSON files in topics directory
    const rawTopics = Object.values(topicModules).map((module: any) => module.default);

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
  }, []);

  return { topics, availableTags };
};