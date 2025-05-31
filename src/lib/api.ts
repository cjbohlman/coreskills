import { supabase } from './supabase';
import { Challenge, UserProgress, LearningPath } from '../types';

export async function getLearningPaths(): Promise<LearningPath[]> {
  const { data, error } = await supabase
    .from('learning_paths')
    .select(`
      *,
      challenges (*)
    `)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getChallenge(id: string): Promise<Challenge> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function submitChallenge(
  userId: string,
  challengeId: string,
  code: string
): Promise<{ success: boolean; message: string; failedTests?: any[] }> {
  // First, get the challenge to access test cases and solution
  const challenge = await getChallenge(challengeId);
  
  // Get current user progress
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .single();

  const attempts = (progressData?.attempts || 0) + 1;

  try {
    // Run test cases
    const testResults = await runTests(code, challenge.test_cases);
    const allTestsPassed = testResults.every(result => result.passed);

    // Update user progress
    await supabase.from('user_progress').upsert({
      user_id: userId,
      challenge_id: challengeId,
      status: allTestsPassed ? 'completed' : 'attempted',
      attempts,
      last_submission: code,
      completed_at: allTestsPassed ? new Date().toISOString() : null
    });

    return {
      success: allTestsPassed,
      message: allTestsPassed 
        ? 'All tests passed! Challenge completed.' 
        : 'Some tests failed. Keep trying!',
      failedTests: allTestsPassed ? undefined : testResults.filter(r => !r.passed)
    };
  } catch (error) {
    console.error('Error running tests:', error);
    return {
      success: false,
      message: 'Error running tests. Please try again.'
    };
  }
}

async function runTests(code: string, testCases: any[]): Promise<any[]> {
  return testCases.map(testCase => {
    try {  
      // Create and execute the function
      const fn = new Function(`
        ${code}
        const funcMatch = ${JSON.stringify(code)}.match(/function\\s+(\\w+)/);
        if (funcMatch) {
          return eval(funcMatch[1]);
        }
      `)();
            
      const output = fn(testCase.input);
      
      return {
        passed: JSON.stringify(output) === JSON.stringify(testCase.expected_output),
        input: testCase.input,
        expected: testCase.expected_output,
        received: output,
        description: testCase.description
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        passed: false,
        input: testCase.input,
        expected: testCase.expected_output,
        error: error.message,
        description: testCase.description
      };
    }
  });
}