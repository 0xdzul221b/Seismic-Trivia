import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topic, difficulty } = await req.json();

  const prompt = `You are a Seismic quiz generator.
Generate ONE multiple choice question about: "${topic}"
Difficulty: ${difficulty}

Seismic is a privacy-focused blockchain using
encrypted mempools, TEEs (Trusted Execution Environments),
and confidential smart contracts.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "question": "...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correct": "A. ...",
  "explanation": "..."
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.choices[0].message.content;

  try {
    const question = JSON.parse(text);
    return NextResponse.json({ question });
  } catch {
    return NextResponse.json({ error: "Parse error" }, { status: 500 });
  }
}
