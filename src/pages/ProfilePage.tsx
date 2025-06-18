import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Settings, User, Award, BookOpen, LogOut, Trophy, Target, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserStats, getRecommendedChallenges } from '../lib/api';

interface UserStats {
  totalAttempted: number;
  totalCompleted: number;
  averageAttempts: number;
  completionRate: number;
  difficultyStats: {
    easy: { completed: number; attempted: number };
    medium: { completed: number; attempted: number };
    hard: { completed: number; attempted: number };
  };
  pathProgress: Array<{
    id: string;
    title: string;
    completed: number;
  }>;
  recentCompletions: any[];
}

const ProfilePage: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recommendedChallenges, setRecommendedChallenges] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoadingStats(true);
      const [userStats, recommended] = await Promise.all([
        getUserStats(user.id),
        getRecommendedChallenges(user.id, 3)
      ]);
      
      setStats(userStats);
      setRecommendedChallenges(recommended);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const getSkillLevel = (completionRate: number) => {
    if (completionRate >= 80) return { level: 'Expert', color: 'text-purple-600 dark:text-purple-400' };
    if (completionRate >= 60) return { level: 'Advanced', color: 'text-blue-600 dark:text-blue-400' };
    if (completionRate >= 40) return { level: 'Intermediate', color: 'text-green-600 dark:text-green-400' };
    if (completionRate >= 20) return { level: 'Beginner', color: 'text-yellow-600 dark:text-yellow-400' };
    return { level: 'Novice', color: 'text-gray-600 dark:text-gray-400' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300';
      case 'medium': return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300';
      case 'hard': return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (loading || loadingStats) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const skillLevel = stats ? getSkillLevel(stats.completionRate) : { level: 'Novice', color: 'text-gray-600' };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-24 w-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <User size={40} />
                  </div>
                  <div className="text-center w-full">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user.user_metadata?.full_name || 'User'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm break-all">
                      {user.email}
                    </p>
                    <div className="mt-2">
                      <span className={`text-sm font-medium ${skillLevel.color}`}>
                        {skillLevel.level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center p-3 rounded-md font-medium transition-colors ${
                      activeTab === 'overview' 
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('progress')}
                    className={`w-full flex items-center p-3 rounded-md font-medium transition-colors ${
                      activeTab === 'progress' 
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <TrendingUp size={18} className="mr-3" />
                    Progress
                  </button>
                  <button 
                    onClick={() => setActiveTab('achievements')}
                    className={`w-full flex items-center p-3 rounded-md font-medium transition-colors ${
                      activeTab === 'achievements' 
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Award size={18} className="mr-3" />
                    Achievements
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center p-3 rounded-md font-medium transition-colors ${
                      activeTab === 'settings' 
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Settings size={18} className="mr-3" />
                    Settings
                  </button>
                </div>

                <div className="mt-8">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => signOut()}
                    leftIcon={<LogOut size={16} />}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {activeTab === 'overview' && (
                <>
                  {/* Stats Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                          <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attempted</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {stats?.totalAttempted || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-success-600 dark:text-success-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {stats?.totalCompleted || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                          <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {stats?.completionRate || 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                          <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Attempts</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {stats?.averageAttempts || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Completions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Completions</h3>
                    
                    {stats?.recentCompletions && stats.recentCompletions.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentCompletions.map((completion) => (
                          <div 
                            key={completion.challenge_id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="mb-2 sm:mb-0">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {completion.challenges?.title || 'Unknown Challenge'}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  getDifficultyColor(completion.challenges?.difficulty || 'easy')
                                }`}>
                                  {completion.challenges?.difficulty?.charAt(0).toUpperCase() + 
                                   completion.challenges?.difficulty?.slice(1) || 'Easy'}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Completed {completion.completed_at ? 
                                    new Date(completion.completed_at).toLocaleDateString() : 'Recently'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {completion.attempts} attempt{completion.attempts !== 1 ? 's' : ''}
                              </div>
                              <Link to={`/challenges/${completion.challenge_id}`}>
                                <Button variant="outline" size="sm">
                                  View Challenge
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No completed challenges yet. Start your journey!
                        </p>
                        <Link to="/challenges" className="mt-4 inline-block">
                          <Button>Browse Challenges</Button>
                        </Link>
                      </div>
                    )}
                  </motion.div>

                  {/* Recommended Challenges */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recommended for You</h3>
                      <Link to="/challenges">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                    
                    {recommendedChallenges.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {recommendedChallenges.map((challenge) => (
                          <div 
                            key={challenge.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {challenge.title}
                                  </h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    getDifficultyColor(challenge.difficulty)
                                  }`}>
                                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                  {challenge.description}
                                </p>
                                {challenge.learning_paths && (
                                  <p className="text-xs text-primary-600 dark:text-primary-400">
                                    {challenge.learning_paths.title}
                                  </p>
                                )}
                              </div>
                              <div className="ml-4">
                                <Link to={`/challenges/${challenge.id}`}>
                                  <Button size="sm">Start</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Great job! You've completed all available challenges.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </>
              )}

              {activeTab === 'progress' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Difficulty Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Progress by Difficulty</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {stats && Object.entries(stats.difficultyStats).map(([difficulty, data]) => (
                        <div key={difficulty} className="text-center">
                          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
                            difficulty === 'easy' ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400' :
                            difficulty === 'medium' ? 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400' :
                            'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400'
                          }`}>
                            {data.attempted > 0 ? Math.round((data.completed / data.attempted) * 100) : 0}%
                          </div>
                          <h4 className="mt-3 font-medium text-gray-900 dark:text-white capitalize">
                            {difficulty}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {data.completed} of {data.attempted} completed
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Path Progress */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Learning Path Progress</h3>
                    {stats?.pathProgress && stats.pathProgress.length > 0 ? (
                      <div className="space-y-4">
                        {stats.pathProgress.map((path) => (
                          <div key={path.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{path.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {path.completed} challenge{path.completed !== 1 ? 's' : ''} completed
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {path.completed}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Start completing challenges to see your progress here.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Achievements</h3>
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Achievement system coming soon! Keep completing challenges to unlock badges and rewards.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h3>
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      User settings panel coming soon! This will include preferences for notifications, privacy, and account management.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;