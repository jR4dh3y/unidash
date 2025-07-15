
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

export async function getDailyProblem(): Promise<LeetCodeDailyProblem | null> {
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
