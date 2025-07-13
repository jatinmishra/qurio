
import { useState, useEffect } from 'react';
import { Terminal, Zap, Target, Trophy } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
}

const Hero = ({ onStartJourney }: HeroProps) => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Level up your coding skills';

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);

    return () => clearInterval(typing);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden matrix-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-primary animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              height: '100px',
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center mb-8">
          <Terminal className="w-16 h-16 text-primary glow-text mr-4" />
          <h1 className="text-6xl font-cyber font-bold text-white glow-text">
            DevQuest
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-2xl text-primary font-mono mb-4">
            {typedText}
            <span className="animate-pulse">|</span>
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Master programming concepts through gamified quizzes and flashcards. 
            Track your progress, unlock achievements, and become the developer you want to be.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="cyber-card w-64 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <Zap className="w-8 h-8 text-secondary mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-white mb-2">Interactive Quizzes</h3>
            <p className="text-gray-400 text-sm">Challenge yourself with coding questions</p>
          </div>

          <div className="cyber-card w-64 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Target className="w-8 h-8 text-accent mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-white mb-2">Smart Flashcards</h3>
            <p className="text-gray-400 text-sm">Reinforce learning with spaced repetition</p>
          </div>

          <div className="cyber-card w-64 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Trophy className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-400 text-sm">Monitor your growth across topics</p>
          </div>
        </div>

        <button 
          className="cyber-button text-lg px-8 py-4 animate-glow-pulse"
          onClick={onStartJourney}
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
};

export default Hero;
