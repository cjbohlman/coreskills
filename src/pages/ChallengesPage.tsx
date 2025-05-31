import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Bug, Code2, Network, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { LearningPath, Challenge } from '../types';
import { getLearningPaths } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const ChallengesPage: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    try {
      const data = await getLearningPaths();
      setPaths(data);
    } catch (err) {
      setError('Failed to load learning paths');
      console.error(err);
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
      default:
        return <Code2 className="w-6 h-6" />;
    }
  };

  const filteredPaths = paths.map(path => ({
    ...path,
    challenges: path.challenges?.filter(challenge =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(path => path.challenges && path.challenges.length > 0);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Learning Paths
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
              className="max-w-xl"
            />
          </div>

          {error ? (
            <div className="bg-error-50 dark:bg-error-900/30 text-error-800 dark:text-error-200 p-4 rounded-lg mb-8">
              {error}
            </div>
          ) : (
            <div className="space-y-12">
              {filteredPaths.map((path) => (
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
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {path.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {path.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {path.challenges?.map((challenge, index) => (
                      <div
                        key={challenge.id}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {index + 1}. {challenge.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                challenge.difficulty === 'easy'
                                  ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                                  : challenge.difficulty === 'medium'
                                  ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                                  : 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
                              }`}>
                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                              {challenge.description}
                            </p>
                          </div>
                          <div className="ml-6">
                            {user ? (
                              <Link to={`/challenges/${challenge.id}`}>
                                <Button>Start Challenge</Button>
                              </Link>
                            ) : (
                              <Button disabled leftIcon={<Lock size={16} />}>
                                Sign in to Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChallengesPage;