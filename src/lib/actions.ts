
'use server';

import type { LeetCodeDailyProblem } from './types';

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

export async function getDailyProblemAction(): Promise<LeetCodeDailyProblem | null> {
  try {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/', 
      },
      body: JSON.stringify({ query: DAILY_PROBLEM_QUERY }),
       // No-cors mode is not needed for server-side fetches.
       // cache: 'no-store' can be useful to prevent stale data.
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch LeetCode daily problem:', response.status, response.statusText);
      // It's helpful to log the response body if possible, to see error details from the API
      const errorBody = await response.text();
      console.error('LeetCode API error body:', errorBody);
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
