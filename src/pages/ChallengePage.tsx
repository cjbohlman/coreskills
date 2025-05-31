import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Challenge } from '../types';
import { getChallenge, submitChallenge } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
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
    if (!user || !challenge) return;
    
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const result = await submitChallenge(user.id, challenge.id, code);
      setResult(result);
    } catch (err) {
      setError('Failed to submit solution');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetCode = () => {
    if (challenge) {
      setCode(challenge.initial_code);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {challenge.title}
              </h1>
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
              Problem Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Code Editor
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetCode}
                      leftIcon={<RefreshCw size={16} />}
                    >
                      Reset Code
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <CodeMirror
                    value={code}
                    height="400px"
                    theme={vscodeDark}
                    extensions={[javascript()]}
                    onChange={(value) => setCode(value)}
                    className="border border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  isLoading={submitting}
                  disabled={submitting || !user}
                >
                  {user ? 'Submit Solution' : 'Sign in to Submit'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
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
                    <div>
                      <p className={`font-medium ${
                        error
                          ? 'text-error-800 dark:text-error-200'
                          : result.success
                          ? 'text-success-800 dark:text-success-200'
                          : 'text-warning-800 dark:text-warning-200'
                      }`}>
                        {error || result.message}
                      </p>
                      {result?.failedTests && (
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
                                Received: {JSON.stringify(test.received) ? JSON.stringify(test.received) : 'No output recieved' }
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
        </div>
      </div>
    </Layout>
  );
};

export default ChallengePage;