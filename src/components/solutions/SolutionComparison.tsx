import React, { useState } from 'react';
import { DrawingCanvas } from '../drawing/DrawingCanvas';
import { Button } from '../ui/Button';
import { 
  Eye, 
  EyeOff, 
  GitCompare, 
  User, 
  BookOpen,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Challenge, CanvasData } from '../../types';

interface SolutionApproach {
  id: string;
  title: string;
  description: string;
  canvasData: CanvasData;
  pros: string[];
  cons: string[];
  complexity: 'low' | 'medium' | 'high';
  scalability: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  bestFor: string[];
  considerations: string[];
}

interface SolutionComparisonProps {
  challenge: Challenge;
  userSubmission?: CanvasData;
  solutionApproaches: SolutionApproach[];
  showUserSubmission: boolean;
  onToggleUserSubmission: () => void;
}

export const SolutionComparison: React.FC<SolutionComparisonProps> = ({
  challenge,
  userSubmission,
  solutionApproaches,
  showUserSubmission,
  onToggleUserSubmission
}) => {
  const [selectedSolutions, setSelectedSolutions] = useState<number[]>([0, 1]);
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay'>('side-by-side');

  const getMetricColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getMetricIcon = (metric: string, level: string) => {
    const iconClass = `w-4 h-4 ${getMetricColor(level)}`;
    
    switch (metric) {
      case 'complexity':
        return <Clock className={iconClass} />;
      case 'scalability':
        return <TrendingUp className={iconClass} />;
      case 'cost':
        return <DollarSign className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const toggleSolutionSelection = (index: number) => {
    if (selectedSolutions.includes(index)) {
      if (selectedSolutions.length > 1) {
        setSelectedSolutions(selectedSolutions.filter(i => i !== index));
      }
    } else {
      if (selectedSolutions.length < 3) {
        setSelectedSolutions([...selectedSolutions, index]);
      } else {
        // Replace the first selected solution
        setSelectedSolutions([selectedSolutions[1], selectedSolutions[2], index]);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Comparison Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Solution Comparison
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Compare different architectural approaches and analyze their trade-offs
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {userSubmission && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleUserSubmission}
                leftIcon={showUserSubmission ? <EyeOff size={16} /> : <Eye size={16} />}
              >
                {showUserSubmission ? 'Hide' : 'Show'} My Solution
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <Button
                variant={comparisonMode === 'side-by-side' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setComparisonMode('side-by-side')}
              >
                Side by Side
              </Button>
              <Button
                variant={comparisonMode === 'overlay' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setComparisonMode('overlay')}
              >
                Overlay
              </Button>
            </div>
          </div>
        </div>

        {/* Solution Selector */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Select Solutions to Compare (max 3):
          </h3>
          <div className="flex flex-wrap gap-2">
            {solutionApproaches.map((approach, index) => (
              <button
                key={approach.id}
                onClick={() => toggleSolutionSelection(index)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSolutions.includes(index)
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 border-2 border-primary-500'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {approach.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Submission */}
      {showUserSubmission && userSubmission && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Your Submission
              </h3>
            </div>
          </div>
          <div className="p-4">
            <DrawingCanvas
              initialData={userSubmission}
              readOnly={true}
            />
          </div>
        </div>
      )}

      {/* Solution Comparison */}
      {comparisonMode === 'side-by-side' ? (
        <div className={`grid gap-8 ${
          selectedSolutions.length === 1 ? 'grid-cols-1' :
          selectedSolutions.length === 2 ? 'grid-cols-1 xl:grid-cols-2' :
          'grid-cols-1 xl:grid-cols-3'
        }`}>
          {selectedSolutions.map(index => {
            const approach = solutionApproaches[index];
            return (
              <div key={approach.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {approach.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {approach.description}
                  </p>
                </div>
                
                <div className="p-4">
                  <DrawingCanvas
                    initialData={approach.canvasData}
                    readOnly={true}
                  />
                </div>
                
                {/* Metrics */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getMetricIcon('complexity', approach.complexity)}
                        <span className="text-xs font-medium text-gray-500">Complexity</span>
                      </div>
                      <span className={`text-sm font-medium capitalize ${getMetricColor(approach.complexity)}`}>
                        {approach.complexity}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getMetricIcon('scalability', approach.scalability)}
                        <span className="text-xs font-medium text-gray-500">Scalability</span>
                      </div>
                      <span className={`text-sm font-medium capitalize ${getMetricColor(approach.scalability)}`}>
                        {approach.scalability}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getMetricIcon('cost', approach.cost)}
                        <span className="text-xs font-medium text-gray-500">Cost</span>
                      </div>
                      <span className={`text-sm font-medium capitalize ${getMetricColor(approach.cost)}`}>
                        {approach.cost}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick Pros/Cons */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                        <CheckCircle size={12} />
                        Key Advantages
                      </h4>
                      <ul className="space-y-1">
                        {approach.pros.slice(0, 2).map((pro, i) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-300">
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Main Challenges
                      </h4>
                      <ul className="space-y-1">
                        {approach.cons.slice(0, 2).map((con, i) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-300">
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Overlay mode - show all selected solutions on one canvas
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Overlay Comparison
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Multiple solutions overlaid for direct comparison
            </p>
          </div>
          <div className="p-4">
            {/* This would need a more complex implementation to overlay multiple canvas data */}
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <GitCompare className="w-12 h-12 mx-auto mb-4" />
              <p>Overlay comparison feature coming soon!</p>
              <p className="text-sm mt-2">Use side-by-side mode for now.</p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Comparison Summary
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Aspect
                </th>
                {selectedSolutions.map(index => (
                  <th key={index} className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {solutionApproaches[index].title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Complexity
                </td>
                {selectedSolutions.map(index => (
                  <td key={index} className="py-3 px-4">
                    <span className={`capitalize font-medium ${getMetricColor(solutionApproaches[index].complexity)}`}>
                      {solutionApproaches[index].complexity}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Scalability
                </td>
                {selectedSolutions.map(index => (
                  <td key={index} className="py-3 px-4">
                    <span className={`capitalize font-medium ${getMetricColor(solutionApproaches[index].scalability)}`}>
                      {solutionApproaches[index].scalability}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Cost
                </td>
                {selectedSolutions.map(index => (
                  <td key={index} className="py-3 px-4">
                    <span className={`capitalize font-medium ${getMetricColor(solutionApproaches[index].cost)}`}>
                      {solutionApproaches[index].cost}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Best For
                </td>
                {selectedSolutions.map(index => (
                  <td key={index} className="py-3 px-4">
                    <div className="space-y-1">
                      {solutionApproaches[index].bestFor.slice(0, 2).map((useCase, i) => (
                        <div key={i} className="text-xs text-gray-600 dark:text-gray-300">
                          • {useCase}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};