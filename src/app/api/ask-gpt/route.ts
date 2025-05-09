import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { matchInsuredName } from "@/lib/match";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // 🔍 Step 1: Ask GPT to extract the insured party
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extract only the name of the insured party from this insurance claim. Respond with ONLY the name, nothing else.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const extractedName = chat.choices[0]?.message.content?.trim() || "";

    // 🧠 Step 2: Match against known insureds
    const { match, confidence } = matchInsuredName(extractedName);

    return NextResponse.json({
      fileResult: {
        extractedName,
        match: match ? match.name : null,
        internalId: match ? match.internalId : null,
        confidence: match ? confidence : 0,
      },
    });
  } catch (err) {
    console.error("❌ ask-gpt error:", err);
    return NextResponse.json({ error: "Failed to contact GPT" }, { status: 500 });
  }
};

export const GET = () => {
  return NextResponse.json({ message: "ask-gpt API is ready ✅" });
};
