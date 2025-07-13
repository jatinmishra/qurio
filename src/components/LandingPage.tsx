import { useState, useEffect } from 'react';
import { Terminal, ArrowRight, Code, Users, BookOpen, GitPullRequest, Upload, CheckCircle, Github, Linkedin } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Evaluate and sharpen your engineering knowledge';

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
    <div className="min-h-screen bg-background matrix-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-primary animate-matrix-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                height: '60px',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center mb-8">
            <Terminal className="w-12 h-12 text-primary glow-text mr-3" />
            <h1 className="text-4xl sm:text-5xl font-cyber font-bold text-white glow-text">
              Qurio
            </h1>
          </div>

          <div className="mb-12">
            <p className="text-xl sm:text-2xl text-primary font-mono mb-6">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
              Qurio is a platform where engineers explore and test their knowledge through community-powered quizzes. 
              Whether you're brushing up on concepts or just curious about how deep your skills go—you're in the right place.
            </p>
            
            <p className="text-md text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
              <strong className="text-primary">Open source</strong> and completely free. 
              Built for the engineering community to share knowledge and evaluate skills together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button 
                className="cyber-button text-lg px-8 py-4 animate-glow-pulse"
                onClick={onGetStarted}
              >
                <span className="flex items-center">
                  Start Evaluating Your Knowledge
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </button>
              
              <a
                href="https://github.com/your-username/qurio"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-button text-lg px-6 py-4 border-secondary text-secondary hover:text-white"
              >
                <span className="flex items-center">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </span>
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="cyber-card text-center">
              <Code className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Test Your Skills</h3>
              <p className="text-gray-400 text-sm">Tackle quizzes that hit real-world scenarios across multiple engineering domains. No trivia—just tech that matters.</p>
            </div>

            <div className="cyber-card text-center">
              <Upload className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Create & Share</h3>
              <p className="text-gray-400 text-sm">Got great questions? Turn your knowledge into quizzes and share with the community.</p>
            </div>

            <div className="cyber-card text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-gray-400 text-s">Questions made by engineers across the globe. Open source, peer-reviewed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-background/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white mb-8">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Choose Topics</h3>
              <p className="text-gray-400 text-sm">Pick from topics curated by the community—or dive into your favorite tech stack.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Test Knowledge</h3>
              <p className="text-gray-400 text-sm">Take quizzes, learn by doing, and track how much you've absorbed.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <GitPullRequest className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Contribute Back</h3>
              <p className="text-gray-400 text-sm">Write and upload your own questions to help others keep learning.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white mb-8">
            Engineering Topics Available
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {['JavaScript', 'React', 'System Design', 'Git', 'Testing', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Database Systems', 'Operating Systems', 'Software Architecture', 'And More...'].map((topic) => (
              <div key={topic} className="cyber-card py-3">
                <p className="text-white font-medium text-sm">{topic}</p>
              </div>
            ))}
          </div>
          
          <p className="text-gray-400 max-w-xl mx-auto">
            Each topic contains community-contributed questions designed to challenge 
            and evaluate your engineering knowledge. No fluff, just solid technical assessment.
          </p>
        </div>
      </div>

      {/* Contribute Section */}
      <div className="py-16 bg-background/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="cyber-card max-w-3xl mx-auto">
            <GitPullRequest className="w-10 h-10 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-cyber font-bold text-white mb-4">
              Built by Engineers, for Engineers
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Qurio isn’t just another learning tool. It’s a space where engineers build, refine, and share knowledge through thoughtful, real-world questions.
              Whether you're contributing content or exploring new topics, you're part of a growing, open-source learning movement.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="text-white font-semibold mb-2">For Question Creators:</h4>
                <p className="text-gray-400 text-sm">
                  Upload your JSON question files via GitHub pull requests. 
                  Share your expertise and help others evaluate their knowledge in areas you've mastered.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">For Knowledge Seekers:</h4>
                <p className="text-gray-400 text-sm">
                  Access high-quality, engineer-vetted questions across multiple topics. 
                  Test your skills, identify gaps, and improve your technical understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 bg-background border-t border-primary/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="cyber-card max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
              Built with ❤️ by jatinmishra
              <a
                href="https://www.linkedin.com/in/jatinmishra11/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/jatinmishra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
