import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        // Define the prompt for the OpenAI API
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // Call the OpenAI API to get a response based on the prompt
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 400,
            stream: true,
            prompt,
        });

        // Stream the response back to the client
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.error('Error occurred:', error); // Log the error for debugging

        // Specific handling for OpenAI API errors
        if (error instanceof OpenAI.APIError) {
            const { name, status, message } = error;
            return NextResponse.json(
                { "type" : name, message },
                { status: status || 500 } // Default to 500 if status is undefined
            );
        }
        // General error handling for any other unexpected errors
        return NextResponse.json(
            { message: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}