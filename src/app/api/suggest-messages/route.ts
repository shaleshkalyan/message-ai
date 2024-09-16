import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, generateText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const prompt = `Here’s a rephrased version of the prompt:
                        "Create a list of three engaging and open-ended questions for an anonymous social messaging platform,
                        designed for a diverse audience. Each question should be separated by ' || ' and
                        should focus on universal themes that encourage friendly and curious interactions. 
                        Avoid sensitive or personal topics. For example, the output could be structured like:
                        'What’s a hobby you’ve recently picked up?' ||
                        'If you could meet any historical figure, who would it be?' || 
                        'What’s something simple that brings you joy?'"
                        Here’s a sample list based on the revised prompt:
                        "What’s a hobby you’ve recently picked up that you’re excited about?" ||
                        "If you could have a conversation with any fictional character, who would it be and why?" ||
                        "What’s a small, everyday thing that never fails to make you smile?"`;

        const { text } = await generateText({
                            model: openai('gpt-4-turbo'),
                            prompt: prompt,
                        });

        return text;
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            console.log('An unexpected error occurred : ', error);
            throw error;
        }

    }
}