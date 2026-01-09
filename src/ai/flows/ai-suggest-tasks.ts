'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting tasks based on the time of day and previous tasks.
 *
 * - suggestTasks - A function that triggers the task suggestion flow.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening).'),
  previousTasks: z.array(z.string()).describe('A list of previously completed or pending tasks.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  suggestedTasks: z.array(z.string()).describe('A list of suggested tasks based on the time of day and previous tasks.'),
});
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are a personal assistant that assists in creating a schedule for the user. Based on the current time of day, and the user\'s previous tasks, suggest tasks that the user should do next.

Time of day: {{{timeOfDay}}}
Previous tasks: {{#each previousTasks}}{{{this}}}\n{{/each}}

Suggest tasks:`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
