
import type { LeetCodeDailyProblem } from './types';

// This file is kept for type definitions, but the fetch logic has been moved
// to a server action in `src/lib/actions.ts` to avoid CORS issues.
// The `getDailyProblem` function is no longer used directly by client components.

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

const DAILY_PROBLEM_QUERY = `
query questionOfToday {
  activeDailyCodingChallengeQuestion {
    date
    userStatus
    link
    question {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      hasVideoSolution
      hasSolution
      topicTags {
        name
        id
        slug
      }
    }
  }
}`;

// This function is deprecated in favor of getDailyProblemAction to avoid CORS issues.
export async function getDailyProblem(): Promise<LeetCodeDailyProblem | null> {
  console.warn("getDailyProblem is deprecated. Use the server action `getDailyProblemAction` instead.");
  try {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/', 
      },
      body: JSON.stringify({ query: DAILY_PROBLEM_QUERY }),
    });

    if (!response.ok) {
      console.error('Failed to fetch LeetCode daily problem:', response.statusText);
      return null;
    }

    const jsonResponse = await response.json();
    
    if (jsonResponse.errors) {
        console.error("LeetCode API returned errors:", jsonResponse.errors);
        return null;
    }
    
    return jsonResponse.data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error('Error fetching LeetCode daily problem:', error);
    return null;
  }
}
