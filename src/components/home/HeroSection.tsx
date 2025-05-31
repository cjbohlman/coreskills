import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Code, Brain, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                <Zap size={16} className="mr-1" />
                Master what AI can't replace
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                Build{' '}
                <span className="text-primary-600 dark:text-primary-500">AI-Proof</span>{' '}
                Programming Skills
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                Learn the essential programming skills that AI can't replace. Become a more valuable developer in the age of AI assistance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" rightIcon={<ChevronRight size={16} />}>
                  Start Learning Now
                </Button>
              </Link>
              <Link to="/challenges">
                <Button size="lg" variant="outline">
                  Explore Challenges
                </Button>
              </Link>
            </div>

            <div className="pt-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Join over 10,000 developers already building AI-proof skills
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-300 dark:bg-gray-700"
                    />
                  ))}
                </div>
                <div className="flex items-center text-sm text-yellow-500">
                  <span className="mr-1">★</span>
                  <span className="mr-1">★</span>
                  <span className="mr-1">★</span>
                  <span className="mr-1">★</span>
                  <span className="mr-1">★</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    4.9/5 from over 500 reviews
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-sm text-gray-200">ai-proof-skills.js</div>
              </div>
              <div className="p-4 overflow-hidden">
                <pre className="text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                  <code>
                    {`// AI-Proof Skill: System Design
const buildResilientSystem = async () => {
  // Skills AI can't replace:
  await Promise.all([
    deepSystemsThinking(),
    practicalProblemSolving(),
    architecturalDecisionMaking(),
    performanceOptimization()
  ]);

  return {
    scalable: true,
    maintainable: true,
    resilient: true,
    future_proof: true
  };
};

// Your career growth awaits
buildResilientSystem()
  .then(career => console.log("Success!"))
  .catch(error => learnAndImprove());`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};