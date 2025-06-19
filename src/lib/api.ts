import { supabase } from './supabase';
import { Challenge, UserProgress, LearningPath, CanvasData } from '../types';

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

export async function getUserProgressWithChallenges(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      challenges (
        id,
        title,
        description,
        difficulty,
        challenge_type,
        path_id,
        learning_paths (
          id,
          title,
          description
        )
      )
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false, nullsLast: true });

  if (error) throw error;
  return data;
}

export async function getUserStats(userId: string) {
  // Get all user progress
  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (progressError) throw progressError;

  // Get completed challenges with their details
  const { data: completedChallenges, error: completedError } = await supabase
    .from('user_progress')
    .select(`
      *,
      challenges (
        id,
        title,
        difficulty,
        challenge_type,
        path_id,
        learning_paths (
          id,
          title
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (completedError) throw completedError;

  // Calculate stats
  const totalAttempted = progressData.length;
  const totalCompleted = progressData.filter(p => p.status === 'completed').length;
  const totalAttempts = progressData.reduce((sum, p) => sum + p.attempts, 0);
  const averageAttempts = totalAttempted > 0 ? Math.round(totalAttempts / totalAttempted * 10) / 10 : 0;

  // Calculate completion rate by difficulty
  const difficultyStats = {
    easy: { completed: 0, attempted: 0 },
    medium: { completed: 0, attempted: 0 },
    hard: { completed: 0, attempted: 0 }
  };

  progressData.forEach(progress => {
    const challenge = completedChallenges.find(c => c.challenge_id === progress.challenge_id);
    if (challenge?.challenges?.difficulty) {
      const difficulty = challenge.challenges.difficulty as 'easy' | 'medium' | 'hard';
      difficultyStats[difficulty].attempted++;
      if (progress.status === 'completed') {
        difficultyStats[difficulty].completed++;
      }
    }
  });

  // Get learning path progress
  const pathProgress = new Map();
  completedChallenges.forEach(progress => {
    const pathId = progress.challenges?.path_id;
    const pathTitle = progress.challenges?.learning_paths?.title;
    if (pathId && pathTitle) {
      if (!pathProgress.has(pathId)) {
        pathProgress.set(pathId, {
          id: pathId,
          title: pathTitle,
          completed: 0
        });
      }
      pathProgress.get(pathId).completed++;
    }
  });

  return {
    totalAttempted,
    totalCompleted,
    averageAttempts,
    completionRate: totalAttempted > 0 ? Math.round((totalCompleted / totalAttempted) * 100) : 0,
    difficultyStats,
    pathProgress: Array.from(pathProgress.values()),
    recentCompletions: completedChallenges.slice(0, 5)
  };
}

export async function getRecommendedChallenges(userId: string, limit: number = 3) {
  // Get user's completed challenges
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('challenge_id')
    .eq('user_id', userId)
    .eq('status', 'completed');

  const completedIds = userProgress?.map(p => p.challenge_id) || [];

  // Get challenges not yet completed, ordered by difficulty (easier first)
  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      learning_paths (
        id,
        title
      )
    `)
    .not('id', 'in', `(${completedIds.length > 0 ? completedIds.join(',') : 'null'})`)
    .order('difficulty', { ascending: true })
    .order('order_index', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function submitChallenge(
  userId: string,
  challengeId: string,
  code: string,
  canvasData?: CanvasData,
  codeReviewAnnotations?: any[]
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
    let allTestsPassed = false;
    let testResults: any[] = [];

    if (challenge.challenge_type === 'system_design') {
      // For system design challenges, check if canvas has elements
      allTestsPassed = canvasData && canvasData.elements && canvasData.elements.length > 0;
      if (!allTestsPassed) {
        return {
          success: false,
          message: 'Please create a system design using the drawing canvas before submitting.'
        };
      }
    } else if (challenge.challenge_type === 'code_review') {
      // For code review challenges, check if annotations were provided
      allTestsPassed = codeReviewAnnotations && codeReviewAnnotations.length > 0;
      if (!allTestsPassed) {
        return {
          success: false,
          message: 'Please identify at least one issue in the code before submitting.'
        };
      }
    } else {
      // Run test cases for coding challenges
      testResults = await runTests(code, challenge.test_cases);
      allTestsPassed = testResults.every(result => result.passed);
    }

    // Update user progress
    const progressUpdate: any = {
      user_id: userId,
      challenge_id: challengeId,
      status: allTestsPassed ? 'completed' : 'attempted',
      attempts,
      last_submission: code,
      completed_at: allTestsPassed ? new Date().toISOString() : null
    };

    // Add canvas data for system design challenges
    if (challenge.challenge_type === 'system_design' && canvasData) {
      progressUpdate.canvas_submission = canvasData;
    }

    // Add code review annotations for code review challenges
    if (challenge.challenge_type === 'code_review' && codeReviewAnnotations) {
      progressUpdate.canvas_submission = { annotations: codeReviewAnnotations };
    }

    await supabase.from('user_progress').upsert(progressUpdate);

    return {
      success: allTestsPassed,
      message: allTestsPassed 
        ? (challenge.challenge_type === 'system_design' 
           ? 'System design submitted successfully!' 
           : challenge.challenge_type === 'code_review'
           ? `Code review submitted successfully! You identified ${codeReviewAnnotations?.length || 0} issues.`
           : 'All tests passed! Challenge completed.')
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

// Community Discussion API functions
export async function getCommunityDiscussions(challengeId: string) {
  const { data, error } = await supabase
    .from('community_discussions')
    .select(`
      *,
      user:auth.users(id, email, user_metadata)
    `)
    .eq('challenge_id', challengeId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDiscussionReplies(parentId: string) {
  const { data, error } = await supabase
    .from('community_discussions')
    .select(`
      *,
      user:auth.users(id, email, user_metadata)
    `)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createDiscussion(
  challengeId: string,
  userId: string,
  content: string,
  tags: string[] = [],
  parentId?: string
) {
  const { data, error } = await supabase
    .from('community_discussions')
    .insert({
      challenge_id: challengeId,
      user_id: userId,
      content,
      tags,
      parent_id: parentId || null
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDiscussionLikes(discussionId: string, increment: boolean = true) {
  const { data, error } = await supabase.rpc('update_discussion_likes', {
    discussion_id: discussionId,
    increment_likes: increment
  });

  if (error) throw error;
  return data;
}

// Check if user has access to solutions
export async function checkSolutionAccess(userId: string, challengeId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('status, canvas_submission, last_submission')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .single();

  if (error) {
    console.log('No user progress found for challenge:', challengeId);
    return false;
  }
  
  // User has access if they've completed the challenge or have any submission
  return data && (
    data.status === 'completed' || 
    data.canvas_submission || 
    (data.last_submission && data.last_submission.trim() !== '')
  );
}