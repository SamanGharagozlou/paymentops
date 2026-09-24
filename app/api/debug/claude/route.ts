import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET() {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Reply with exactly: Claude API works",
        },
      ],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Claude API error",
      },
      { status: 500 }
    );
  }
}