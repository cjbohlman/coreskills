import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

export const DataDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkData = async () => {
    setLoading(true);
    try {
      // Check learning paths
      const { data: paths, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .order('order_index');

      // Check challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .order('order_index');

      // Check learning paths with challenges
      const { data: pathsWithChallenges, error: pathsWithChallengesError } = await supabase
        .from('learning_paths')
        .select(`
          *,
          challenges (*)
        `)
        .order('order_index');

      setDebugInfo({
        paths: { data: paths, error: pathsError },
        challenges: { data: challenges, error: challengesError },
        pathsWithChallenges: { data: pathsWithChallenges, error: pathsWithChallengesError },
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      });
    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkData();
  }, []);

  if (!debugInfo) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
        🔍 Database Debug Information
      </h3>
      
      <div className="space-y-3 text-xs text-blue-700 dark:text-blue-400">
        <div>
          <strong>Supabase Connection:</strong>
          <p>URL: {debugInfo.supabaseUrl || 'Not set'}</p>
          <p>Has Anon Key: {debugInfo.hasAnonKey ? 'Yes' : 'No'}</p>
        </div>

        <div>
          <strong>Learning Paths ({debugInfo.paths?.data?.length || 0}):</strong>
          {debugInfo.paths?.error && (
            <p className="text-red-600">Error: {debugInfo.paths.error.message}</p>
          )}
          {debugInfo.paths?.data?.map((path: any) => (
            <p key={path.id}>• {path.title} (Order: {path.order_index})</p>
          ))}
        </div>

        <div>
          <strong>Challenges ({debugInfo.challenges?.data?.length || 0}):</strong>
          {debugInfo.challenges?.error && (
            <p className="text-red-600">Error: {debugInfo.challenges.error.message}</p>
          )}
          {debugInfo.challenges?.data?.slice(0, 3).map((challenge: any) => (
            <p key={challenge.id}>• {challenge.title} ({challenge.challenge_type})</p>
          ))}
          {debugInfo.challenges?.data?.length > 3 && (
            <p>... and {debugInfo.challenges.data.length - 3} more</p>
          )}
        </div>

        <div>
          <strong>Paths with Challenges:</strong>
          {debugInfo.pathsWithChallenges?.error && (
            <p className="text-red-600">Error: {debugInfo.pathsWithChallenges.error.message}</p>
          )}
          {debugInfo.pathsWithChallenges?.data?.map((path: any) => (
            <p key={path.id}>• {path.title}: {path.challenges?.length || 0} challenges</p>
          ))}
        </div>

        <Button
          size="sm"
          onClick={checkData}
          disabled={loading}
          className="mt-2"
        >
          {loading ? 'Checking...' : 'Refresh Data'}
        </Button>
      </div>
    </div>
  );
};