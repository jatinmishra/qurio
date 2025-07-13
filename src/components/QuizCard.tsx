
import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizCard = ({ 
  question, 
  onAnswer, 
  onNext, 
  onBack, 
  questionNumber, 
  totalQuestions 
}: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(correct);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    onNext();
  };

  const getButtonStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? 'bg-primary/20 border-primary text-primary' 
        : 'hover:bg-gray-800 border-gray-600';
    }
    
    if (index === question.correctAnswer) {
      return 'bg-green-500/20 border-green-500 text-green-400';
    }
    
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-red-500/20 border-red-500 text-red-400';
    }
    
    return 'border-gray-600 text-gray-400';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-card border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <span className="text-sm text-gray-400">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <CardTitle className="text-lg text-white mt-4">
            {question.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  getButtonStyle(index)
                }`}
                disabled={showResult}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center mr-3 text-xs">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="space-y-4">
              <div className={`flex items-center gap-2 text-sm ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">Explanation:</strong> {question.explanation}
                </p>
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-primary hover:bg-primary/90 text-black font-medium"
              >
                Next Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCard;
