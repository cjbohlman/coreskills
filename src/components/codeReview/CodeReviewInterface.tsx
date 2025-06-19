import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Bug,
  Zap,
  Shield,
  Code,
  RefreshCw
} from 'lucide-react';
import { Challenge } from '../../types';

interface CodeReviewAnnotation {
  id: string;
  line: number;
  issueType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion: string;
}

interface CodeReviewInterfaceProps {
  challenge: Challenge;
  onSubmit: (annotations: CodeReviewAnnotation[], timeSpent: number) => void;
  readOnly?: boolean;
  initialAnnotations?: CodeReviewAnnotation[];
}

const ISSUE_TYPES = [
  { value: 'security', label: 'Security Vulnerability', icon: <Shield size={16} />, color: 'text-red-600' },
  { value: 'performance', label: 'Performance Issue', icon: <Zap size={16} />, color: 'text-yellow-600' },
  { value: 'bug', label: 'Bug/Logic Error', icon: <Bug size={16} />, color: 'text-red-500' },
  { value: 'maintainability', label: 'Maintainability', icon: <Code size={16} />, color: 'text-blue-600' },
  { value: 'naming', label: 'Naming Convention', icon: <Code size={16} />, color: 'text-purple-600' },
  { value: 'duplication', label: 'Code Duplication', icon: <RefreshCw size={16} />, color: 'text-orange-600' },
  { value: 'error_handling', label: 'Error Handling', icon: <AlertTriangle size={16} />, color: 'text-red-600' },
  { value: 'resource_management', label: 'Resource Management', icon: <Zap size={16} />, color: 'text-green-600' },
  { value: 'thread_safety', label: 'Thread Safety', icon: <Shield size={16} />, color: 'text-indigo-600' },
  { value: 'architecture', label: 'Architecture/Design', icon: <Code size={16} />, color: 'text-gray-600' }
];

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

export const CodeReviewInterface: React.FC<CodeReviewInterfaceProps> = ({
  challenge,
  onSubmit,
  readOnly = false,
  initialAnnotations = []
}) => {
  const [annotations, setAnnotations] = useState<CodeReviewAnnotation[]>(initialAnnotations);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState<Partial<CodeReviewAnnotation>>({
    issueType: 'bug',
    severity: 'medium',
    description: '',
    suggestion: ''
  });
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const getLanguageExtension = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return javascript();
      case 'python':
        return python();
      case 'java':
        return java();
      case 'c#':
      case 'csharp':
        return cpp(); // Close enough for syntax highlighting
      default:
        return javascript();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLineClick = (lineNumber: number) => {
    if (readOnly) return;
    
    setSelectedLine(lineNumber);
    setNewAnnotation({
      ...newAnnotation,
      line: lineNumber
    });
    setShowAnnotationForm(true);
  };

  const addAnnotation = () => {
    if (!newAnnotation.description || !newAnnotation.suggestion || selectedLine === null) return;

    const annotation: CodeReviewAnnotation = {
      id: Date.now().toString(),
      line: selectedLine,
      issueType: newAnnotation.issueType || 'bug',
      severity: newAnnotation.severity || 'medium',
      description: newAnnotation.description,
      suggestion: newAnnotation.suggestion
    };

    setAnnotations([...annotations, annotation]);
    setShowAnnotationForm(false);
    setNewAnnotation({
      issueType: 'bug',
      severity: 'medium',
      description: '',
      suggestion: ''
    });
    setSelectedLine(null);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  const handleSubmit = () => {
    onSubmit(annotations, timeSpent);
  };

  const getIssueTypeInfo = (type: string) => {
    return ISSUE_TYPES.find(t => t.value === type) || ISSUE_TYPES[0];
  };

  const codeLines = challenge.initial_code.split('\n');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time: {formatTime(timeSpent)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Issues Found: {annotations.length}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAnnotations(!showAnnotations)}
            leftIcon={showAnnotations ? <EyeOff size={16} /> : <Eye size={16} />}
          >
            {showAnnotations ? 'Hide' : 'Show'} Issues
          </Button>
          {challenge.solution_code && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSolution(!showSolution)}
              leftIcon={<Eye size={16} />}
            >
              {showSolution ? 'Hide' : 'Show'} Solution
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Code Review - {challenge.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Click on line numbers to add annotations
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 z-10">
                {codeLines.map((_, index) => {
                  const lineNumber = index + 1;
                  const hasAnnotation = annotations.some(a => a.line === lineNumber);
                  
                  return (
                    <div
                      key={lineNumber}
                      className={`h-6 flex items-center justify-center text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                        hasAnnotation ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'text-gray-500'
                      } ${selectedLine === lineNumber ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                      onClick={() => handleLineClick(lineNumber)}
                    >
                      {lineNumber}
                    </div>
                  );
                })}
              </div>
              
              <div className="pl-12">
                <CodeMirror
                  value={showSolution ? challenge.solution_code : challenge.initial_code}
                  height="500px"
                  theme={vscodeDark}
                  extensions={[getLanguageExtension('javascript')]}
                  editable={false}
                  className="text-sm"
                />
              </div>
              
              {/* Annotation Markers */}
              {showAnnotations && annotations.map(annotation => (
                <div
                  key={annotation.id}
                  className="absolute right-2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ 
                    top: `${(annotation.line - 1) * 24 + 8}px`,
                    backgroundColor: annotation.severity === 'critical' ? '#dc2626' : 
                                   annotation.severity === 'high' ? '#ea580c' :
                                   annotation.severity === 'medium' ? '#d97706' : '#2563eb'
                  }}
                  title={annotation.description}
                >
                  !
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Annotations Panel */}
        <div className="space-y-4">
          {/* Add Annotation Form */}
          {showAnnotationForm && !readOnly && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add Issue - Line {selectedLine}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issue Type
                  </label>
                  <select
                    value={newAnnotation.issueType}
                    onChange={(e) => setNewAnnotation({...newAnnotation, issueType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {ISSUE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Severity
                  </label>
                  <select
                    value={newAnnotation.severity}
                    onChange={(e) => setNewAnnotation({...newAnnotation, severity: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <Input
                  label="Issue Description"
                  value={newAnnotation.description || ''}
                  onChange={(e) => setNewAnnotation({...newAnnotation, description: e.target.value})}
                  placeholder="Describe the issue..."
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suggested Fix
                  </label>
                  <textarea
                    value={newAnnotation.suggestion || ''}
                    onChange={(e) => setNewAnnotation({...newAnnotation, suggestion: e.target.value})}
                    placeholder="How should this be fixed?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={addAnnotation}
                    leftIcon={<Plus size={16} />}
                  >
                    Add Issue
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAnnotationForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Annotations List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Issues Identified ({annotations.length})
              </h4>
            </div>
            
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {annotations.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No issues identified yet. Click on line numbers to add annotations.
                </p>
              ) : (
                annotations.map(annotation => {
                  const typeInfo = getIssueTypeInfo(annotation.issueType);
                  
                  return (
                    <div
                      key={annotation.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={typeInfo.color}>
                            {typeInfo.icon}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Line {annotation.line}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${SEVERITY_COLORS[annotation.severity]}`}>
                            {annotation.severity}
                          </span>
                        </div>
                        {!readOnly && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAnnotation(annotation.id)}
                            leftIcon={<Trash2 size={14} />}
                          />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Issue:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {annotation.description}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Suggested Fix:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {annotation.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Submit Button */}
          {!readOnly && (
            <Button
              fullWidth
              onClick={handleSubmit}
              leftIcon={<Save size={16} />}
              disabled={annotations.length === 0}
            >
              Submit Code Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};