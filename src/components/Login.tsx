
import { useState } from 'react';
import { User, Lock, Terminal, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        onLogin(username);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden matrix-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-primary animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              height: '80px',
            }}
          />
        ))}
      </div>

      <div className="cyber-card max-w-md w-full mx-4 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Terminal className="w-12 h-12 text-primary glow-text" />
          </div>
          <h1 className="text-3xl font-cyber font-bold text-white glow-text mb-2">
            Access Terminal
          </h1>
          <p className="text-gray-400">Enter your credentials to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full cyber-button py-3 text-lg font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  Initialize Session
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Demo mode - any username will work
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
