import React from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, BookOpen, Users, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    title: 'Problem-Solving Skills',
    description:
      'Learn to dissect complex programming challenges and develop systematic approaches to problem solving.',
  },
  {
    icon: <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    title: 'System Design',
    description:
      'Master the art of designing scalable, maintainable systems that meet business requirements.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    title: 'Computer Science Fundamentals',
    description:
      'Build a solid foundation in data structures, algorithms, and computational thinking.',
  },
  {
    icon: <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    title: 'Collaborative Skills',
    description:
      'Develop techniques for effective communication and collaboration in software development teams.',
  },
  {
    icon: <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    title: 'Performance Optimization',
    description:
      'Learn strategies to identify and eliminate bottlenecks in code and systems.',
  },
  {
    icon: <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    title: 'Security Mindset',
    description:
      'Build the skills to anticipate, identify, and mitigate security vulnerabilities in software.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Skills That AI <span className="text-primary-600 dark:text-primary-400">Can't Replace</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our curriculum focuses on the essential programming skills that remain valuable even as AI tools become more powerful.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="bg-primary-50 dark:bg-gray-800 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};