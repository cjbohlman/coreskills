import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Settings, User, Award, BookOpen, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
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

  const completedChallenges = [
    {
      id: '1',
      title: 'System Design: E-commerce Platform',
      completedAt: '2023-05-15',
      score: 92,
    },
    {
      id: '2',
      title: 'Algorithmic Trading Strategy',
      completedAt: '2023-04-22',
      score: 88,
    },
    {
      id: '3',
      title: 'Database Indexing Optimization',
      completedAt: '2023-04-10',
      score: 95,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-1"
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
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <button className="w-full flex items-center p-3 rounded-md text-gray-700 dark:text-gray-300 bg-primary-50 dark:bg-primary-900/30 font-medium">
                    <User size={18} className="mr-3" />
                    Profile
                  </button>
                  <button className="w-full flex items-center p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Award size={18} className="mr-3" />
                    Achievements
                  </button>
                  <button className="w-full flex items-center p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BookOpen size={18} className="mr-3" />
                    Learning Path
                  </button>
                  <button className="w-full flex items-center p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
            <div className="md:col-span-3 space-y-8">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                      <Award className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills Level</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">Intermediate</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">3 Challenges</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                      <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">92%</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Completed Challenges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Completed Challenges</h3>
                
                <div className="space-y-6">
                  {completedChallenges.map((challenge) => (
                    <div 
                      key={challenge.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <h4 className="font-medium text-gray-900 dark:text-white">{challenge.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Completed on {new Date(challenge.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Score</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">{challenge.score}%</div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Suggested Challenges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested Challenges</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">Memory Optimization Techniques</h4>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300">
                        Advanced
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Apply memory optimization techniques to improve application performance.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">API Security Implementation</h4>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300">
                        Intermediate
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Implement comprehensive security measures for a REST API.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;