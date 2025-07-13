
import { Trophy, Target, Calendar, Zap, ArrowLeft } from 'lucide-react';

interface ProgressStats {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  level: number;
  topics: Array<{
    id: string;
    name: string;
    completed: number;
    total: number;
    level: number;
    accuracy: number;
  }>;
}

interface ProgressProps {
  stats: ProgressStats;
  onBack?: () => void;
}

const Progress = ({ stats, onBack }: ProgressProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="cyber-button px-4 py-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-cyber font-bold text-white mb-4 glow-text">
            Progress Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Track your learning journey
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="cyber-card text-center">
            <div className="text-2xl font-bold text-primary mb-2">{stats.totalQuestions}</div>
            <div className="text-gray-400">Questions Answered</div>
          </div>
          <div className="cyber-card text-center">
            <div className="text-2xl font-bold text-secondary mb-2">{stats.correctAnswers}</div>
            <div className="text-gray-400">Correct Answers</div>
          </div>
          <div className="cyber-card text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0}%
            </div>
            <div className="text-gray-400">Overall Accuracy</div>
          </div>
          <div className="cyber-card text-center">
            <div className="text-2xl font-bold text-primary mb-2">{stats.level}</div>
            <div className="text-gray-400">Highest Level</div>
          </div>
        </div>

        {/* Topic Progress */}
        <div className="cyber-card">
          <h2 className="text-2xl font-bold text-white mb-6 glow-text">Topic Progress</h2>
          <div className="space-y-4">
            {stats.topics.map((topic) => (
              <div key={topic.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-white">{topic.name}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">
                      Level {topic.level}
                    </span>
                    <span className="text-sm text-primary">
                      {topic.accuracy}% accuracy
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    {topic.completed} / {topic.total} questions
                  </span>
                  <span className="text-sm text-gray-400">
                    {Math.round((topic.completed / topic.total) * 100)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(topic.completed / topic.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Section */}
        <div className="cyber-card">
          <h2 className="text-2xl font-bold text-white mb-6 glow-text">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              stats.totalQuestions >= 10 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-600 bg-gray-800/50'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-white">First Steps</div>
                <div className="text-sm text-gray-400">Answer 10 questions</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              stats.streak >= 7 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-600 bg-gray-800/50'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">🔥</div>
                <div className="font-semibold text-white">Week Warrior</div>
                <div className="text-sm text-gray-400">7-day streak</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              stats.topics.reduce((acc, topic) => acc + topic.completed, 0) >= 50 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-600 bg-gray-800/50'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-semibold text-white">Knowledge Master</div>
                <div className="text-sm text-gray-400">Complete 50 questions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
