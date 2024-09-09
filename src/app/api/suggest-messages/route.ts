import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, generateText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    
    try {     
        const { messages } = await req.json();
      
        const { text } = await generateText({
            model: openai('gpt-4-turbo'),
            messages : convertToCoreMessages(messages),
          });
      
        return text;
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const {name, status, headers, message} = error;
            return NextResponse.json({name, status, headers, message},{status});
        } else {
            console.log('An unexpected error occurred : ', error);
            throw error;
        }
        
    }
}