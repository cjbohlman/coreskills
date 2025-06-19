import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { DrawingCanvas } from '../components/drawing/DrawingCanvas';
import { CodeReviewInterface } from '../components/codeReview/CodeReviewInterface';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Challenge, CanvasData } from '../types';
import { getChallenge, submitChallenge } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle, RefreshCw, ArrowLeft, Layout as LayoutIcon, Code2, Search, BookOpen } from 'lucide-react';

const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [codeReviewAnnotations, setCodeReviewAnnotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) loadChallenge(id);
  }, [id]);

  const loadChallenge = async (challengeId: string) => {
    try {
      const data = await getChallenge(challengeId);
      if (!data) {
        setNotFound(true);
        return;
      }
      setChallenge(data);
      setCode(data.initial_code);
      if (data.canvas_data) {
        setCanvasData(data.canvas_data as CanvasData);
      }
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        setNotFound(true);
      } else {
        setError('Failed to load challenge');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !challenge) {
      console.log('Cannot submit: missing user or challenge', { user: !!user, challenge: !!challenge });
      return;
    }
    
    console.log('=== STARTING SUBMISSION PROCESS ===');
    console.log('Challenge type:', challenge.challenge_type);
    console.log('User ID:', user.id);
    console.log('Challenge ID:', challenge.id);
    
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      let submitResult;
      
      if (challenge.challenge_type === 'system_design') {
        console.log('=== SYSTEM DESIGN SUBMISSION ===');
        console.log('Canvas data exists:', !!canvasData);
        console.log('Canvas elements count:', canvasData?.elements?.length || 0);
        console.log('Canvas data:', canvasData);
        
        if (!canvasData || !canvasData.elements || canvasData.elements.length === 0) {
          console.log('❌ No canvas data - showing error');
          setResult({
            success: false,
            message: 'Please create a system design using the drawing canvas before submitting.'
          });
          return;
        }
        
        console.log('✅ Canvas data valid - calling submitChallenge API');
        submitResult = await submitChallenge(user.id, challenge.id, '', canvasData);
        console.log('✅ API call completed:', submitResult);
        
      } else if (challenge.challenge_type === 'code_review') {
        console.log('=== CODE REVIEW SUBMISSION ===');
        console.log('Annotations count:', codeReviewAnnotations.length);
        console.log('Annotations:', codeReviewAnnotations);
        
        if (codeReviewAnnotations.length === 0) {
          console.log('❌ No annotations - showing error');
          setResult({
            success: false,
            message: 'Please identify at least one issue in the code before submitting.'
          });
          return;
        }
        
        console.log('✅ Annotations valid - calling submitChallenge API');
        submitResult = await submitChallenge(user.id, challenge.id, '', undefined, codeReviewAnnotations);
        console.log('✅ API call completed:', submitResult);
        
      } else {
        console.log('=== CODING CHALLENGE SUBMISSION ===');
        console.log('Code length:', code.length);
        console.log('Code preview:', code.substring(0, 100) + '...');
        
        if (!code.trim()) {
          console.log('❌ No code - showing error');
          setResult({
            success: false,
            message: 'Please write some code before submitting.'
          });
          return;
        }
        
        console.log('✅ Code valid - calling submitChallenge API');
        submitResult = await submitChallenge(user.id, challenge.id, code);
        console.log('✅ API call completed:', submitResult);
      }
      
      console.log('=== SUBMISSION RESULT ===');
      console.log('Success:', submitResult.success);
      console.log('Message:', submitResult.message);
      console.log('Full result:', submitResult);
      
      setResult(submitResult);
      
      if (submitResult.success) {
        console.log('🎉 Submission successful! Setting up navigation...');
        
        // Show success message immediately
        setResult({
          ...submitResult,
          showNavigation: true
        });
        
        // Navigate to solutions page after 2 seconds
        setTimeout(() => {
          console.log('🚀 Navigating to solutions page...');
          navigate(`/solutions/${challenge.id}`);
        }, 2000);
      } else {
        console.log('❌ Submission failed:', submitResult.message);
      }
      
    } catch (err: any) {
      console.error('💥 SUBMISSION ERROR:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(`Failed to submit solution: ${err.message}`);
    } finally {
      console.log('=== SUBMISSION PROCESS COMPLETE ===');
      setSubmitting(false);
    }
  };

  const resetCode = () => {
    if (challenge) {
      setCode(challenge.initial_code);
    }
  };

  const handleCanvasSave = (data: CanvasData) => {
    console.log('📝 Canvas data saved:', data);
    console.log('Elements count:', data.elements?.length || 0);
    setCanvasData(data);
  };

  const handleCodeReviewSubmit = (annotations: any[], timeSpent: number) => {
    console.log('📝 Code review annotations received:', annotations);
    console.log('Time spent:', timeSpent);
    setCodeReviewAnnotations(annotations);
  };

  const canSubmit = () => {
    if (!user) {
      console.log('Cannot submit: no user');
      return false;
    }
    
    if (isSystemDesign) {
      const canSubmitDesign = canvasData && canvasData.elements && canvasData.elements.length > 0;
      console.log('Can submit system design:', canSubmitDesign, {
        hasCanvasData: !!canvasData,
        elementsCount: canvasData?.elements?.length || 0
      });
      return canSubmitDesign;
    } else if (isCodeReview) {
      const canSubmitReview = codeReviewAnnotations.length > 0;
      console.log('Can submit code review:', canSubmitReview, {
        annotationsCount: codeReviewAnnotations.length
      });
      return canSubmitReview;
    } else {
      const canSubmitCode = code.trim() !== '';
      console.log('Can submit code:', canSubmitCode, {
        codeLength: code.length
      });
      return canSubmitCode;
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

  if (notFound) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Challenge Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              The challenge you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate('/challenges')}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back to Challenges
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!challenge) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-error-50 dark:bg-error-900/30 text-error-800 dark:text-error-200 p-4 rounded-lg">
            Failed to load challenge
          </div>
        </div>
      </Layout>
    );
  }

  const isSystemDesign = challenge.challenge_type === 'system_design';
  const isCodeReview = challenge.challenge_type === 'code_review';

  const getChallengeTypeIcon = () => {
    if (isSystemDesign) return <LayoutIcon size={16} />;
    if (isCodeReview) return <Search size={16} />;
    return <Code2 size={16} />;
  };

  const getChallengeTypeLabel = () => {
    if (isSystemDesign) return 'System Design';
    if (isCodeReview) return 'Code Review';
    return 'Coding';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/challenges')}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {challenge.title}
                  </h1>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {getChallengeTypeIcon()}
                    {getChallengeTypeLabel()}
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              challenge.difficulty === 'easy'
                ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                : challenge.difficulty === 'medium'
                ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                : 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
            }`}>
              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {isSystemDesign ? 'Design Requirements' : isCodeReview ? 'Code Review Instructions' : 'Problem Description'}
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 font-sans">
                {challenge.description}
              </pre>
            </div>
          </div>

          {isCodeReview ? (
            // Code Review Interface
            <div className="space-y-4">
              <CodeReviewInterface
                challenge={challenge}
                onSubmit={handleCodeReviewSubmit}
              />
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  isLoading={submitting}
                  disabled={submitting || !canSubmit()}
                >
                  {submitting 
                    ? 'Submitting Review...'
                    : user 
                      ? 'Submit Code Review' 
                      : 'Sign in to Submit'
                  }
                </Button>
              </div>
            </div>
          ) : (
            // Regular Challenge Interface
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {isSystemDesign ? 'System Design Canvas' : 'Code Editor'}
                      </h3>
                      {!isSystemDesign && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetCode}
                          leftIcon={<RefreshCw size={16} />}
                        >
                          Reset Code
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    {isSystemDesign ? (
                      <DrawingCanvas
                        onSave={handleCanvasSave}
                        initialData={canvasData || undefined}
                      />
                    ) : (
                      <CodeMirror
                        value={code}
                        height="400px"
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        onChange={(value) => setCode(value)}
                        className="border border-gray-200 dark:border-gray-700 rounded-md"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    isLoading={submitting}
                    disabled={submitting || !canSubmit()}
                  >
                    {submitting 
                      ? (isSystemDesign ? 'Saving Design...' : 'Running Tests...')
                      : user 
                        ? (isSystemDesign ? 'Submit Design' : 'Submit Solution') 
                        : 'Sign in to Submit'
                    }
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {!isSystemDesign && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Test Cases
                    </h3>
                    <div className="space-y-4">
                      {challenge.test_cases.map((testCase: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Test {index + 1}: {testCase.description}
                          </p>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>Input: {JSON.stringify(testCase.input)}</p>
                            <p>Expected: {JSON.stringify(testCase.expected_output)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isSystemDesign && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Design Guidelines
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Use rectangles to represent services and databases</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Use arrows to show data flow and communication</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Add text labels to identify components clearly</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Consider scalability, reliability, and performance</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Include load balancers, caches, and databases</p>
                      </div>
                    </div>
                  </div>
                )}

                {(error || result) && (
                  <div className={`p-6 rounded-lg ${
                    error
                      ? 'bg-error-50 dark:bg-error-900/30'
                      : result.success
                      ? 'bg-success-50 dark:bg-success-900/30'
                      : 'bg-warning-50 dark:bg-warning-900/30'
                  }`}>
                    <div className="flex items-start">
                      {error ? (
                        <AlertCircle className="h-5 w-5 text-error-500 dark:text-error-400 mr-3" />
                      ) : result.success ? (
                        <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400 mr-3" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-warning-500 dark:text-warning-400 mr-3" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${
                          error
                            ? 'text-error-800 dark:text-error-200'
                            : result.success
                            ? 'text-success-800 dark:text-success-200'
                            : 'text-warning-800 dark:text-warning-200'
                        }`}>
                          {error || result.message}
                        </p>
                        
                        {result?.success && result?.showNavigation && (
                          <div className="mt-4 flex items-center gap-3">
                            <Button
                              size="sm"
                              onClick={() => navigate(`/solutions/${challenge.id}`)}
                              leftIcon={<BookOpen size={16} />}
                            >
                              View Solutions Now
                            </Button>
                            <span className="text-sm text-success-600 dark:text-success-400">
                              Auto-redirecting in 2 seconds...
                            </span>
                          </div>
                        )}
                        
                        {result?.failedTests && !isSystemDesign && !isCodeReview && (
                          <div className="mt-4 space-y-3">
                            {result.failedTests.map((test: any, index: number) => (
                              <div key={index} className="text-sm">
                                <p className="font-medium text-gray-700 dark:text-gray-300">
                                  Failed Test {index + 1}: {test.description}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Input: {JSON.stringify(test.input)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Expected: {JSON.stringify(test.expected)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Received: {JSON.stringify(test.received) ? JSON.stringify(test.received) : 'No output received' }
                                </p>
                                {test.error && (
                                  <p className="text-error-600 dark:text-error-400">
                                    Error: {test.error}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChallengePage;