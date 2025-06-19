import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SubmissionDebugProps {
  challenge: any;
  canvasData: any;
  onTestSubmit: () => void;
}

export const SubmissionDebug: React.FC<SubmissionDebugProps> = ({
  challenge,
  canvasData,
  onTestSubmit
}) => {
  const { user } = useAuth();

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
        🔍 Debug Information
      </h3>
      
      <div className="space-y-2 text-xs text-blue-700 dark:text-blue-400">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>User Status:</strong></p>
            <p>• Signed In: {user ? '✅ Yes' : '❌ No'}</p>
            <p>• User ID: {user?.id || 'None'}</p>
            <p>• Email: {user?.email || 'None'}</p>
          </div>
          
          <div>
            <p><strong>Challenge Status:</strong></p>
            <p>• Challenge Loaded: {challenge ? '✅ Yes' : '❌ No'}</p>
            <p>• Challenge Type: {challenge?.challenge_type || 'Unknown'}</p>
            <p>• Challenge ID: {challenge?.id || 'None'}</p>
          </div>
        </div>
        
        <div>
          <p><strong>Canvas Data:</strong></p>
          <p>• Canvas Exists: {canvasData ? '✅ Yes' : '❌ No'}</p>
          <p>• Elements Count: {canvasData?.elements?.length || 0}</p>
          <p>• Canvas Valid: {(canvasData && canvasData.elements && canvasData.elements.length > 0) ? '✅ Yes' : '❌ No'}</p>
        </div>
        
        <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
          <button
            onClick={() => {
              console.log('🧪 DEBUG TEST BUTTON CLICKED');
              console.log('Current state:', {
                user: !!user,
                challenge: !!challenge,
                canvasData: !!canvasData,
                canvasElements: canvasData?.elements?.length || 0
              });
              onTestSubmit();
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            🧪 Test Submit Function
          </button>
        </div>
      </div>
    </div>
  );
};