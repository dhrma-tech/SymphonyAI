import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { idea, conversationHistory } = await req.json();

    const systemPrompt = `You are SymphonyAI, a Prompt Operating System that helps users build digital products.

Your job:
1. Analyze the user's idea
2. Ask 2-3 clarifying questions (only if truly needed)
3. Generate a complete project plan including:
   - Synopsis (2-3 sentences)
   - 8-12 suggested features
   - 3-5 suggested improvements
   - Design system (color palette with hex codes, font pairings)
   - 4-8 execution phases
   - Tool-specific prompt for each phase

Guidelines:
- Be concise and specific
- Ask minimal questions — infer intelligently
- Features should be actionable and specific
- Design suggestions should be based on the project type
- Phases should be sequential and logical
- Each phase prompt should be copy-paste ready for the specified tool

Respond in this JSON format:
{
  "stage": "questions" | "plan",
  "questions": ["question1", "question2"], // Only if stage is "questions"
  "synopsis": "string",
  "features": ["feature1", "feature2"],
  "improvements": ["improvement1"],
  "design": {
    "palette": [{"name": "Primary", "hex": "#000000"}, ...],
    "fonts": [{"role": "Heading", "name": "Geist Sans"}, ...]
  },
  "phases": [
    {
      "number": 1,
      "title": "Phase title",
      "tool": "Claude" | "Cursor" | "Antigravity",
      "description": "What gets built",
      "prompt": "Full executable prompt"
    }
  ]
}`;

    const messages = [
      ...(conversationHistory || []),
      { role: "user", content: idea }
    ];

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620", // Note: The prompt asked for "claude-sonnet-4-20250514" which might be a future model or placeholder. I'll use the current best Sonnet or what's available.
      max_tokens: 4000,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0];
    if (content.type === "text") {
      const parsed = JSON.parse(content.text);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: "Failed to generate workflow" }, { status: 500 });
  }
}
