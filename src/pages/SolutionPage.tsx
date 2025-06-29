import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { DrawingCanvas } from '../components/drawing/DrawingCanvas';
import { SolutionComparison } from '../components/solutions/SolutionComparison';
import { CommunityDiscussion } from '../components/solutions/CommunityDiscussion';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  GitCompare, 
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Users,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Challenge, CanvasData, UserProgress } from '../types';
import { getChallenge, getUserProgress, checkSolutionAccess } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface SolutionApproach {
  id: string;
  title: string;
  description: string;
  canvasData?: CanvasData;
  pros: string[];
  cons: string[];
  complexity: 'low' | 'medium' | 'high';
  scalability: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  bestFor: string[];
  considerations: string[];
}

// Canvas Loading Component
const CanvasLoader: React.FC = () => (
  <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
      <p className="text-sm text-gray-600 dark:text-gray-300">Loading architecture diagram...</p>
    </div>
  </div>
);

// Canvas Component with key prop to force re-render
const SolutionCanvas: React.FC<{ approach: SolutionApproach; isLoading: boolean }> = ({ 
  approach, 
  isLoading 
}) => {
  if (isLoading) {
    return <CanvasLoader />;
  }

  if (!approach.canvasData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">No diagram available for this approach</p>
        </div>
      </div>
    );
  }

  return (
    <DrawingCanvas
      key={`${approach.id}-${Date.now()}`} // Force re-render when approach changes
      initialData={approach.canvasData}
      readOnly={true}
    />
  );
};

const SolutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedApproach, setSelectedApproach] = useState(0);
  const [showUserSubmission, setShowUserSubmission] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [solutionApproaches, setSolutionApproaches] = useState<SolutionApproach[]>([]);
  const [canvasLoading, setCanvasLoading] = useState(false);

  useEffect(() => {
    if (id && user) {
      loadChallengeAndProgress();
    }
  }, [id, user]);

  // Handle approach selection with loading state
  const handleApproachSelection = (index: number) => {
    if (index !== selectedApproach) {
      setCanvasLoading(true);
      setSelectedApproach(index);
      
      // Simulate loading time for better UX
      setTimeout(() => {
        setCanvasLoading(false);
      }, 300);
    }
  };

  const loadChallengeAndProgress = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      const [challengeData, progressData, accessGranted] = await Promise.all([
        getChallenge(id),
        getUserProgress(user.id),
        checkSolutionAccess(user.id, id)
      ]);

      setChallenge(challengeData);
      setHasAccess(accessGranted);
      
      // Find user's progress for this specific challenge
      const userChallengeProgress = progressData.find(p => p.challenge_id === id);
      setUserProgress(userChallengeProgress || null);

      // Parse solution approaches from challenge data
      if (challengeData.solution_approaches && Array.isArray(challengeData.solution_approaches)) {
        setSolutionApproaches(challengeData.solution_approaches as SolutionApproach[]);
      } else {
        // Fallback to default approaches if none in database
        setSolutionApproaches(getDefaultSolutionApproaches());
      }

    } catch (err) {
      setError('Failed to load challenge data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSolutionApproaches = (): SolutionApproach[] => [
    {
      id: 'microservices',
      title: 'Microservices Architecture',
      description: 'A distributed architecture with independent services for each business domain.',
      canvasData: {
        elements: [
          { id: '1', type: 'rectangle', x: 50, y: 100, width: 120, height: 60, color: '#3B82F6', strokeWidth: 2 },
          { id: '2', type: 'rectangle', x: 200, y: 100, width: 120, height: 60, color: '#10B981', strokeWidth: 2 },
          { id: '3', type: 'rectangle', x: 350, y: 100, width: 120, height: 60, color: '#F59E0B', strokeWidth: 2 },
          { id: '4', type: 'text', x: 110, y: 135, text: 'User Service', color: '#1F2937', strokeWidth: 1 },
          { id: '5', type: 'text', x: 250, y: 135, text: 'Order Service', color: '#1F2937', strokeWidth: 1 },
          { id: '6', type: 'text', x: 400, y: 135, text: 'Payment Service', color: '#1F2937', strokeWidth: 1 },
          { id: '7', type: 'rectangle', x: 200, y: 250, width: 120, height: 60, color: '#8B5CF6', strokeWidth: 2 },
          { id: '8', type: 'text', x: 245, y: 285, text: 'Database', color: '#1F2937', strokeWidth: 1 },
          { id: '9', type: 'arrow', startX: 110, startY: 160, endX: 110, endY: 200, color: '#6B7280', strokeWidth: 2 },
          { id: '10', type: 'arrow', startX: 260, startY: 160, endX: 260, endY: 250, color: '#6B7280', strokeWidth: 2 }
        ],
        canvasWidth: 800,
        canvasHeight: 400
      },
      pros: [
        'High scalability and flexibility',
        'Independent deployment and development',
        'Technology diversity allowed',
        'Fault isolation between services'
      ],
      cons: [
        'Increased complexity in service coordination',
        'Network latency between services',
        'Distributed system challenges',
        'Higher operational overhead'
      ],
      complexity: 'high',
      scalability: 'high',
      cost: 'high',
      bestFor: [
        'Large-scale applications',
        'Teams with microservices expertise',
        'Applications requiring high availability',
        'Complex business domains'
      ],
      considerations: [
        'Implement proper service discovery',
        'Use API gateways for external communication',
        'Implement distributed tracing',
        'Plan for eventual consistency'
      ]
    },
    {
      id: 'monolithic',
      title: 'Modular Monolith',
      description: 'A single deployable unit with well-defined internal module boundaries.',
      canvasData: {
        elements: [
          { id: '1', type: 'rectangle', x: 200, y: 80, width: 300, height: 200, color: '#3B82F6', strokeWidth: 3 },
          { id: '2', type: 'rectangle', x: 220, y: 100, width: 80, height: 50, color: '#10B981', strokeWidth: 2 },
          { id: '3', type: 'rectangle', x: 320, y: 100, width: 80, height: 50, color: '#F59E0B', strokeWidth: 2 },
          { id: '4', type: 'rectangle', x: 420, y: 100, width: 80, height: 50, color: '#EF4444', strokeWidth: 2 },
          { id: '5', type: 'rectangle', x: 270, y: 180, width: 160, height: 50, color: '#8B5CF6', strokeWidth: 2 },
          { id: '6', type: 'text', x: 245, y: 130, text: 'User Module', color: '#1F2937', strokeWidth: 1 },
          { id: '7', type: 'text', x: 340, y: 130, text: 'Order Module', color: '#1F2937', strokeWidth: 1 },
          { id: '8', type: 'text', x: 435, y: 130, text: 'Payment Module', color: '#1F2937', strokeWidth: 1 },
          { id: '9', type: 'text', x: 330, y: 210, text: 'Shared Database', color: '#1F2937', strokeWidth: 1 },
          { id: '10', type: 'text', x: 320, y: 60, text: 'Monolithic Application', color: '#1F2937', strokeWidth: 1 }
        ],
        canvasWidth: 800,
        canvasHeight: 400
      },
      pros: [
        'Simpler deployment and testing',
        'Better performance (no network calls)',
        'Easier debugging and monitoring',
        'Lower operational complexity'
      ],
      cons: [
        'Limited scalability options',
        'Technology stack lock-in',
        'Potential for tight coupling',
        'Larger deployment units'
      ],
      complexity: 'low',
      scalability: 'medium',
      cost: 'low',
      bestFor: [
        'Small to medium applications',
        'Teams new to distributed systems',
        'Applications with simple domains',
        'Rapid prototyping and MVP development'
      ],
      considerations: [
        'Maintain clear module boundaries',
        'Use dependency injection',
        'Implement proper layering',
        'Plan for future decomposition'
      ]
    }
  ];

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getComplexityBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'high': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Please sign in to view challenge solutions.
            </p>
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasAccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Solution Locked
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              You must submit your solution to this challenge before viewing the official solutions.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(`/challenges/${id}`)}>
                Complete Challenge
              </Button>
              <Button variant="outline" onClick={() => navigate('/challenges')}>
                Browse Challenges
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !challenge) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-error-50 dark:bg-error-900/30 text-error-800 dark:text-error-200 p-4 rounded-lg">
            {error || 'Challenge not found'}
          </div>
        </div>
      </Layout>
    );
  }

  if (solutionApproaches.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Solutions Coming Soon
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              The solutions for this challenge are being prepared. Please check back later.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(`/challenges/${id}`)}>
                Back to Challenge
              </Button>
              <Button variant="outline" onClick={() => navigate('/challenges')}>
                Browse Other Challenges
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const currentApproach = solutionApproaches[selectedApproach];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/challenges/${id}`)}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back to Challenge
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {challenge.title} - Solutions
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Explore multiple approaches and compare with your submission
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Challenge Completed
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Solution Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'comparison'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GitCompare size={16} />
                  Compare Solutions
                </div>
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'discussion'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Community Discussion
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Approach Selector */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Solution Approaches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {solutionApproaches.map((approach, index) => (
                    <motion.div
                      key={approach.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedApproach === index
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleApproachSelection(index)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {approach.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {approach.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Complexity:</span>
                          <span className={`font-medium ${getComplexityColor(approach.complexity)}`}>
                            {approach.complexity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Scale:</span>
                          <span className={`font-medium ${getComplexityColor(approach.scalability)}`}>
                            {approach.scalability}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Selected Approach Details */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Architecture Diagram */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {currentApproach.title} - Architecture
                    </h3>
                  </div>
                  <div className="p-4">
                    <Suspense fallback={<CanvasLoader />}>
                      <SolutionCanvas 
                        approach={currentApproach} 
                        isLoading={canvasLoading}
                      />
                    </Suspense>
                  </div>
                </div>

                {/* Approach Analysis */}
                <div className="space-y-6">
                  {/* Metrics */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Approach Metrics
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getComplexityBg(currentApproach.complexity)}`}>
                          <span className={`text-lg font-bold ${getComplexityColor(currentApproach.complexity)}`}>
                            {currentApproach.complexity === 'low' ? 'L' : currentApproach.complexity === 'medium' ? 'M' : 'H'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">Complexity</p>
                        <p className="text-xs text-gray-500 capitalize">{currentApproach.complexity}</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getComplexityBg(currentApproach.scalability)}`}>
                          <TrendingUp className={`w-6 h-6 ${getComplexityColor(currentApproach.scalability)}`} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">Scalability</p>
                        <p className="text-xs text-gray-500 capitalize">{currentApproach.scalability}</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getComplexityBg(currentApproach.cost)}`}>
                          <span className={`text-lg font-bold ${getComplexityColor(currentApproach.cost)}`}>$</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">Cost</p>
                        <p className="text-xs text-gray-500 capitalize">{currentApproach.cost}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Trade-offs Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                          <CheckCircle size={16} />
                          Advantages
                        </h4>
                        <ul className="space-y-2">
                          {currentApproach.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                          <AlertTriangle size={16} />
                          Disadvantages
                        </h4>
                        <ul className="space-y-2">
                          {currentApproach.cons.map((con, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Best Use Cases */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Lightbulb size={18} />
                      When to Use This Approach
                    </h3>
                    <ul className="space-y-2 mb-4">
                      {currentApproach.bestFor.map((useCase, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Key Considerations
                    </h4>
                    <ul className="space-y-2">
                      {currentApproach.considerations.map((consideration, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <SolutionComparison
              challenge={challenge}
              userSubmission={userProgress?.canvas_submission as CanvasData}
              solutionApproaches={solutionApproaches}
              showUserSubmission={showUserSubmission}
              onToggleUserSubmission={() => setShowUserSubmission(!showUserSubmission)}
            />
          )}

          {activeTab === 'discussion' && (
            <CommunityDiscussion
              challengeId={challenge.id}
              challengeTitle={challenge.title}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SolutionPage;