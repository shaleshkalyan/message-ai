import { NextResponse } from 'next/server';
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        let prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. 
        These questions are for an anonymous social messaging platform and should be suitable for a diverse audience. 
        Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. 
        For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||
        If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
        Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const aiMessage = result.response.text();

        // Validate response format
        const questions = aiMessage.split('||');
        if (questions.length !== 3) {
            throw new Error('Invalid response format. Expected three questions.');
        }
        return NextResponse.json({ type: "success", message: aiMessage });
    } catch (error: any) {
        switch (error.code) {
            case 'PERMISSION_DENIED':
                console.error('Permission denied: You may not have the necessary permissions to use the Gemini AI API.');
                return NextResponse.json({ type: "error", message: 'Permission denied.' }, { status: 403 });
            case 'INVALID_ARGUMENT':
                console.error('Invalid argument: Please check the provided prompt, temperature, or maxTokens values.');
                return NextResponse.json({ type: "error", message: 'Invalid request.' }, { status: 400 });
            case 'RESOURCE_EXHAUSTED':
                console.error('Resource exhausted: The API is currently overloaded. Please try again later.');
                return NextResponse.json({ type: "error", message: 'API overloaded. Try again later.' }, { status: 503 });
            default:
                console.error('Unexpected error:', error);
                return NextResponse.json({ type: "error", message: 'Internal server error.' }, { status: 500 });
        }
    }
}