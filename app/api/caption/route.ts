import { NextRequest, NextResponse } from "next/server";

interface CaptionRequestBody {
  topic?: string;
  platform?: string;
  tone?: string;
  length?: "short" | "medium" | "long";
  includeEmojis?: boolean;
  includeHashtags?: boolean;
  imageData?: { mimeType: string; base64: string }[];
  keyframes?: { mimeType: string; base64: string; timestamp?: number }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CaptionRequestBody = await request.json().catch(() => ({}));
    const {
      topic = "",
      platform = "Instagram",
      tone = "Viral & Engaging",
      length = "medium",
      includeEmojis = true,
      includeHashtags = false,
      imageData = [],
      keyframes = [],
    } = body;

    const hasMedia = (imageData && imageData.length > 0) || (keyframes && keyframes.length > 0);

    if (!topic.trim() && !hasMedia) {
      return NextResponse.json(
        { error: "Please provide a topic or upload media for caption generation." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const lengthGuide = {
      short: "1 sentence, punchy and concise (under 100 characters)",
      medium: "2-3 sentences, engaging with a clear hook (100-250 characters)",
      long: "3-5 sentences, storytelling format with emotional depth (250-500 characters)",
    }[length];

    const prompt = `You are an elite social media copywriter and content strategist.

TASK:
Generate exactly 3 unique caption variations for a ${platform} post.
${topic.trim() ? `Topic/Context: "${topic.trim()}"` : "Analyze the provided media and craft captions based on what you see."}
${hasMedia ? "Use the attached media to inform your captions — describe what you see and craft captions around it." : ""}

REQUIREMENTS:
- Platform: ${platform}
- Tone/Vibe: ${tone}
- Length: ${lengthGuide}
- ${includeEmojis ? "Include relevant emojis naturally" : "Do NOT include any emojis"}
- ${includeHashtags ? "Include 3-5 relevant hashtags at the end of each caption" : "Do NOT include hashtags"}
- Each caption must have a different hook style:
  1. "question" - Start with a compelling question
  2. "statement" - Start with a bold statement or hot take
  3. "story" - Start with a mini story or personal touch

OUTPUT FORMAT (strictly valid JSON):
{
  "captions": [
    { "text": "Caption text here...", "hookType": "question" },
    { "text": "Caption text here...", "hookType": "statement" },
    { "text": "Caption text here...", "hookType": "story" }
  ]
}`;

    const parts: Array<{
      text?: string;
      inline_data?: { mime_type: string; data: string };
    }> = [{ text: prompt }];

    if (imageData && imageData.length > 0) {
      for (const img of imageData) {
        if (img.base64 && img.mimeType) {
          parts.push({
            inline_data: {
              mime_type: img.mimeType,
              data: img.base64.replace(/^data:[^;]+;base64,/, ""),
            },
          });
        }
      }
    }

    if (keyframes && keyframes.length > 0) {
      for (const kf of keyframes) {
        if (kf.base64 && kf.mimeType) {
          parts.push({
            inline_data: {
              mime_type: kf.mimeType,
              data: kf.base64.replace(/^data:[^;]+;base64,/, ""),
            },
          });
        }
      }
    }

    const requestPayload = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.85,
        response_mime_type: "application/json",
      },
    };

    const models = [
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-2.5-flash",
    ];

    let geminiResponse: Response | null = null;
    let lastError = "";

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });

        if (resp.ok) {
          geminiResponse = resp;
          break;
        } else {
          const errData = await resp.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (geminiResponse && geminiResponse.ok) {
      const data = await geminiResponse.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      try {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed.captions) && parsed.captions.length > 0) {
          return NextResponse.json({ captions: parsed.captions });
        }
      } catch {
        // Fall through to fallback
      }
    }

    const topicText = topic.trim() || "your amazing content";
    const fallbackCaptions = [
      {
        text: includeEmojis
          ? `Ever wondered what makes ${topicText} truly special? \u{1F914}\u{2728} Here's a glimpse into something extraordinary.`
          : `Ever wondered what makes ${topicText} truly special? Here's a glimpse into something extraordinary.`,
        hookType: "question",
      },
      {
        text: includeEmojis
          ? `This changes everything about ${topicText} \u{1F525} The results speak for themselves.`
          : `This changes everything about ${topicText}. The results speak for themselves.`,
        hookType: "statement",
      },
      {
        text: includeEmojis
          ? `Started this journey with ${topicText} and never looked back \u{1F4AB} Every moment has been worth it.`
          : `Started this journey with ${topicText} and never looked back. Every moment has been worth it.`,
        hookType: "story",
      },
    ];

    return NextResponse.json({
      captions: fallbackCaptions,
      fallbackUsed: true,
      error: lastError || undefined,
    });
  } catch (error: unknown) {
    console.error("Error in /api/caption:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
