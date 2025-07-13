
import { useState } from 'react';
import { ArrowLeft, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface FlashcardProps {
  question: Question;
  onNext: () => void;
  onPrevious: () => void;
  onBack?: () => void;
  cardNumber: number;
  totalCards: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const Flashcard = ({ 
  question, 
  onNext, 
  onPrevious, 
  onBack,
  cardNumber, 
  totalCards, 
  canGoNext, 
  canGoPrevious 
}: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    onNext();
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    onPrevious();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Back Button */}
      {onBack && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onBack}
              className="cyber-button px-4 py-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Return to topic selection</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Card className="cyber-card min-h-[400px]">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-white">
              Flashcard {cardNumber} of {totalCards}
            </CardTitle>
            <div className="w-1/3 bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(cardNumber / totalCards) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-80">
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`flex-1 cursor-pointer transition-all duration-500 transform ${
                  isFlipped ? 'rotateY-180' : ''
                }`}
                onClick={handleFlip}
              >
                <div className="h-full flex items-center justify-center p-6 rounded-lg border border-gray-600 bg-gray-800/50 hover:border-gray-500 transition-colors">
                  {!isFlipped ? (
                    <div className="text-center">
                      <p className="text-lg text-gray-100 leading-relaxed mb-4">
                        {question.question}
                      </p>
                      <p className="text-sm text-gray-400">Click to reveal answer</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <p className="text-md text-primary font-semibold mb-2">Correct Answer:</p>
                        <p className="text-lg text-gray-100">
                          {question.options[question.correctAnswer]}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-600">
                        <p className="text-sm text-gray-300">{question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to {isFlipped ? 'show question' : 'reveal answer'}</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex justify-between items-center mt-6 space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  variant="outline"
                  className="cyber-button flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to previous flashcard</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleFlip}
                  variant="outline"
                  className="cyber-button px-6"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Flip
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Flip the flashcard</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="cyber-button flex-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to next flashcard</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Flashcard;
