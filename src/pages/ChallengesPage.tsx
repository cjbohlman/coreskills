import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Bug, Code2, Network, Layout as LayoutIcon, CheckCircle2, Lock, Search as SearchIcon, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { LearningPath, Challenge, UserProgress } from '../types';
import { getLearningPaths, getUserProgress } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const ChallengesPage: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load learning paths
      const pathsData = await getLearningPaths();
      setPaths(pathsData);
      
      // Load user progress if user is logged in
      if (user) {
        const progressData = await getUserProgress(user.id);
        setUserProgress(progressData);
      } else {
        setUserProgress([]);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError('Failed to load learning paths: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'bug':
        return <Bug className="w-6 h-6" />;
      case 'code-2':
        return <Code2 className="w-6 h-6" />;
      case 'network':
        return <Network className="w-6 h-6" />;
      case 'layout':
        return <LayoutIcon className="w-6 h-6" />;
      case 'search':
        return <SearchIcon className="w-6 h-6" />;
      default:
        return <Code2 className="w-6 h-6" />;
    }
  };

  const getChallengeTypeIcon = (challengeType: string) => {
    switch (challengeType) {
      case 'system_design':
        return <LayoutIcon className="w-4 h-4" />;
      case 'code_review':
        return <SearchIcon className="w-4 h-4" />;
      case 'coding':
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const getChallengeTypeLabel = (challengeType: string) => {
    switch (challengeType) {
      case 'system_design':
        return 'System Design';
      case 'code_review':
        return 'Code Review';
      case 'coding':
      default:
        return 'Coding';
    }
  };

  const getChallengeActionText = (challengeType: string) => {
    switch (challengeType) {
      case 'system_design':
        return 'Design System';
      case 'code_review':
        return 'Review Code';
      case 'coding':
      default:
        return 'Start Challenge';
    }
  };

  const getChallengeProgress = (challengeId: string) => {
    return userProgress.find(progress => progress.challenge_id === challengeId);
  };

  const isChallengeCompleted = (challengeId: string) => {
    const progress = getChallengeProgress(challengeId);
    return progress?.status === 'completed';
  };

  const getChallengeButton = (challenge: Challenge) => {
    if (!user) {
      return (
        <Button disabled leftIcon={<Lock size={16} />}>
          Sign in to Start
        </Button>
      );
    }

    const isCompleted = isChallengeCompleted(challenge.id);
    const progress = getChallengeProgress(challenge.id);

    if (isCompleted) {
      return (
        <div className="flex items-center gap-2">
          <Link to={`/challenges/${challenge.id}`}>
            <Button variant="outline" leftIcon={<CheckCircle2 size={16} />}>
              Completed
            </Button>
          </Link>
          <Link to={`/solutions/${challenge.id}`}>
            <Button size="sm" leftIcon={<BookOpen size={16} />}>
              View Solutions
            </Button>
          </Link>
        </div>
      );
    }

    if (progress?.status === 'attempted') {
      return (
        <Link to={`/challenges/${challenge.id}`}>
          <Button variant="outline">
            Continue Challenge
          </Button>
        </Link>
      );
    }

    return (
      <Link to={`/challenges/${challenge.id}`}>
        <Button>
          {getChallengeActionText(challenge.challenge_type)}
        </Button>
      </Link>
    );
  };

  // Filter paths and challenges based on search query
  const filteredPaths = paths.map(path => {
    // Filter challenges within each path
    const filteredChallenges = path.challenges?.filter(challenge =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return {
      ...path,
      challenges: filteredChallenges
    };
  }).filter(path => {
    // If there's no search query, show all paths
    if (!searchQuery.trim()) {
      return true;
    }
    
    // If there's a search query, show paths that either:
    // 1. Have matching challenges, OR
    // 2. Have a matching path title/description
    const pathMatches = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       path.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasMatchingChallenges = path.challenges && path.challenges.length > 0;
    
    return pathMatches || hasMatchingChallenges;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Learning Paths
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Master AI-proof programming skills through hands-on challenges, system design exercises, and code review practice.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
              className="max-w-xl mx-auto"
            />
          </div>

          {error && (
            <div className="bg-error-50 dark:bg-error-900/30 text-error-800 dark:text-error-200 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-medium mb-2">Error Loading Learning Paths</h3>
              <p>{error}</p>
              <Button 
                className="mt-4" 
                onClick={loadData}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {paths.length === 0 && !error ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No learning paths found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                It looks like there are no learning paths available yet.
              </p>
              <Button onClick={loadData}>
                Refresh
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredPaths.map((path) => {
                const completedChallenges = path.challenges?.filter(challenge => 
                  isChallengeCompleted(challenge.id)
                ).length || 0;
                const totalChallenges = path.challenges?.length || 0;

                return (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                          {getIconComponent(path.icon)}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {path.title}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {path.description}
                          </p>
                          {user && totalChallenges > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(completedChallenges / totalChallenges) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {completedChallenges}/{totalChallenges} completed
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {totalChallenges} challenge{totalChallenges !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Show challenges if they exist */}
                    {path.challenges && path.challenges.length > 0 ? (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {path.challenges.map((challenge, index) => {
                          const isCompleted = isChallengeCompleted(challenge.id);
                          const progress = getChallengeProgress(challenge.id);

                          return (
                            <div
                              key={challenge.id}
                              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                isCompleted ? 'bg-green-50 dark:bg-green-900/10' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                      {index + 1}.
                                    </span>
                                    {isCompleted && (
                                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    )}
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                      {challenge.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        challenge.difficulty === 'easy'
                                          ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                                          : challenge.difficulty === 'medium'
                                          ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                                          : 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
                                      }`}>
                                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                      </span>
                                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {getChallengeTypeIcon(challenge.challenge_type)}
                                        {getChallengeTypeLabel(challenge.challenge_type)}
                                      </span>
                                      {progress?.status === 'attempted' && !isCompleted && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                          In Progress
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {challenge.description.split('\n')[0]}
                                  </p>
                                  {progress && (
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                      {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                                      {progress.completed_at && (
                                        <span className="ml-2">
                                          • Completed {new Date(progress.completed_at).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="ml-6 flex-shrink-0">
                                  {getChallengeButton(challenge)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm">
                          {searchQuery 
                            ? 'No challenges match your search in this learning path.'
                            : 'Challenges for this learning path are coming soon!'
                          }
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {filteredPaths.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No challenges found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try adjusting your search terms or browse all challenges.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChallengesPage;