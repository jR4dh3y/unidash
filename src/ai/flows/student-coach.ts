
'use server';
/**
 * @fileOverview An AI agent that acts as a development coach for students.
 *
 * - studentCoach - A function that provides guidance and encouragement.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StudentCoachInputSchema = z.string();
export type StudentCoachInput = z.infer<typeof StudentCoachInputSchema>;

const StudentCoachOutputSchema = z.string();
export type StudentCoachOutput = z.infer<typeof StudentCoachOutputSchema>;

export async function studentCoach(input: StudentCoachInput): Promise<StudentCoachOutput> {
  return studentCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentCoachPrompt',
  input: { schema: StudentCoachInputSchema },
  output: { schema: StudentCoachOutputSchema },
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are a friendly and encouraging Developer Coach for students learning to code. Your goal is to provide helpful, clear, and motivating advice. Do not give direct code solutions unless specifically asked, but instead guide the student to discover the solution themselves.

Here is the student's question or problem:
"{{{input}}}"

Provide a concise, helpful, and encouraging response. Think step-by-step. Break down complex topics into smaller, manageable pieces. If they seem frustrated, offer words of encouragement.`,
});

const studentCoachFlow = ai.defineFlow(
  {
    name: 'studentCoachFlow',
    inputSchema: StudentCoachInputSchema,
    outputSchema: StudentCoachOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (output === null) {
        return "I'm sorry, I'm having trouble coming up with a response right now. Could you please try rephrasing your question?";
    }
    return output;
  }
);
