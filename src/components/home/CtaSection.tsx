import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ChevronRight } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-primary-600 dark:bg-primary-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-white"></div>
        <div className="absolute -left-20 top-1/3 w-80 h-80 rounded-full bg-white"></div>
        <div className="absolute right-1/4 bottom-10 w-40 h-40 rounded-full bg-white"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Ready to Future-Proof Your Programming Skills?
            </h2>
            <p className="text-xl text-primary-100">
              Join our community of developers who are mastering AI-proof programming skills and staying ahead in the tech industry.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50 focus:ring-white"
                  rightIcon={<ChevronRight size={16} />}
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/challenges">
                <Button
                  size="lg"
                  className="border-white text-white hover:bg-primary-50 hover:text-primary-600 focus:ring-white"
                >
                  Explore Free Challenges
                </Button>
              </Link>
            </div>

            <p className="text-primary-100 text-sm">
              No credit card required. Start building AI-proof skills today.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};