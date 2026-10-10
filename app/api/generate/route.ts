import { NextRequest, NextResponse } from "next/server";

interface KeyframeItem {
  mimeType: string;
  base64: string;
  timestamp?: number;
}

interface ImageItem {
  mimeType: string;
  base64: string;
}

interface GenerateRequestBody {
  caption?: string;
  platform?: string;
  keywords?: string;
  tone?: string;
  count?: number;
  videoData?: {
    mimeType: string;
    base64: string;
  };
  keyframes?: KeyframeItem[];
  imageData?: ImageItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequestBody = await request.json().catch(() => ({}));
    const {
      caption = "",
      platform = "Instagram",
      keywords = "",
      tone = "Viral & Engaging",
      count = 15,
      videoData,
      keyframes = [],
      imageData = [],
    } = body;

    const hasKeyframes = Array.isArray(keyframes) && keyframes.length > 0;
    const hasVideoData = Boolean(videoData?.base64 && videoData?.mimeType);
    const hasImages = Array.isArray(imageData) && imageData.length > 0;
    const isVideoMode = hasKeyframes || hasVideoData;
    const isImageMode = hasImages && !isVideoMode;

    if (!isVideoMode && !isImageMode && (!caption || typeof caption !== "string" || !caption.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid caption, upload a video, or upload images." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured. Please add your GEMINI_API_KEY in .env.local to enable AI hashtag generation.",
        },
        { status: 500 }
      );
    }

    const targetCount = Math.max(3, Math.min(Number(count) || 15, 30));

    const platformGuidelines: Record<string, string> = {
      Instagram:
        "Balanced mix of popular high-volume tags, active community tags, and precise niche tags for maximum discoverability and Explore/Reels page ranking.",
      YouTube:
        "SEO-focused tags and searchable topic keywords optimized for YouTube search algorithms, Shorts feed, related video suggestions, and topic indexing.",
      LinkedIn:
        "Professional, industry-specific, career, leadership, and B2B-oriented hashtags suitable for professional feeds and business networking.",
      X: "Concise, trending, high-impact, and conversation-starting hashtags optimized for rapid feeds and strict character limits.",
      TikTok:
        "FYP-optimized hashtags combining trending sounds/challenges, niche community tags, and content-specific keywords for maximum For You Page reach, duet/stitch discoverability, and TikTok SEO.",
    };

    const targetGuideline =
      platformGuidelines[platform] || platformGuidelines.Instagram;

    let prompt = "";
    if (isVideoMode) {
      prompt = `You are an elite social media visual analyst, viral video strategist, and hashtag discovery algorithm expert.

TASK:
Analyze the provided video ${hasKeyframes ? "keyframes captured across the duration of the video" : "recording"} in high detail.
Understand:
1. Visual subjects: What or who is shown (people, objects, scenery, products, actions)?
2. Action and movement: What is happening? Is it a tutorial, vlog, workout, dance, landscape, comedic moment, culinary preparation, tech demo, etc.?
3. Setting and aesthetic: Lighting, environment, color palette, mood, and vibe.
4. Target platform audience: Optimize specifically for ${platform} viewers in the "${tone}" tone.

BASED ON YOUR DEEP VIDEO ANALYSIS:
1. Generate an engaging, hook-driven social media caption / summary for this video (2-3 sentences, natural tone, with tasteful emojis).
2. Generate approximately ${targetCount} hashtags categorized into 3 strategic tiers:
   - "trending": High-volume, broad discovery hashtags currently thriving on ${platform}.
   - "niche": Community-specific, targeted, medium-competition hashtags with high engagement intent.
   - "topic": Exact subject matter, category, and keyword hashtags describing what is explicitly shown in this video.
3. For each hashtag, estimate realistic engagement metrics:
   - "volume": Search/post volume estimate (e.g. "2.4M", "520K", "85K")
   - "reach": "High" | "Medium" | "Low"
   - "difficulty": "Hard" | "Medium" | "Easy"

VIDEO DETAILS:
- Platform: ${platform}
- Target Hashtag Count: ${targetCount}
- Requested Tone / Vibe: ${tone}
- Platform Strategy Guidelines: ${targetGuideline}
${caption.trim() ? `- Creator's Notes / Caption Hint: "${caption.trim()}"` : ""}
${keywords.trim() ? `- Focus Keywords: "${keywords.trim()}"` : ""}

REQUIREMENTS:
- Every hashtag must start with '#' followed by alphanumeric characters only (no spaces, punctuation, emojis).
- Format hashtags using clean PascalCase (e.g. #CookingVlog, #TokyoStreets, #MorningRoutine).
- No duplicates across categories.
- Output MUST be strictly valid JSON matching this exact structure:
{
  "detectedSummary": "Detailed hook-driven video summary caption...",
  "categories": {
    "trending": ["#tag1", "#tag2"],
    "niche": ["#tag3", "#tag4"],
    "topic": ["#tag5", "#tag6"]
  },
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "metrics": {
    "#tag1": { "volume": "1.5M", "reach": "High", "difficulty": "Hard" }
  }
}`;
    } else if (isImageMode) {
      prompt = `You are an elite social media visual analyst, content strategist, and hashtag discovery expert.

TASK:
Analyze the provided ${imageData.length > 1 ? `${imageData.length} images (carousel/multi-image post)` : "image"} in high detail.
Understand:
1. Visual subjects: What or who is shown (people, objects, scenery, products, food, fashion, etc.)?
2. Composition and style: Photography style, color palette, lighting, mood, aesthetic quality.
3. Context clues: Location hints, branding, text overlays, seasonal elements.
4. Target platform audience: Optimize specifically for ${platform} viewers in the "${tone}" tone.

BASED ON YOUR DEEP IMAGE ANALYSIS:
1. Generate an engaging, hook-driven social media caption for this ${imageData.length > 1 ? "carousel post" : "image post"} (2-3 sentences, natural tone, with tasteful emojis).
2. Generate approximately ${targetCount} hashtags categorized into 3 strategic tiers:
   - "trending": High-volume, broad discovery hashtags currently thriving on ${platform}.
   - "niche": Community-specific, targeted, medium-competition hashtags with high engagement intent.
   - "topic": Exact subject matter, category, and keyword hashtags describing what is explicitly shown.
3. For each hashtag, estimate realistic engagement metrics:
   - "volume": Search/post volume estimate (e.g. "2.4M", "520K", "85K")
   - "reach": "High" | "Medium" | "Low"
   - "difficulty": "Hard" | "Medium" | "Easy"

IMAGE DETAILS:
- Platform: ${platform}
- Image Count: ${imageData.length}
- Target Hashtag Count: ${targetCount}
- Requested Tone / Vibe: ${tone}
- Platform Strategy Guidelines: ${targetGuideline}
${caption.trim() ? `- Creator's Notes / Caption Hint: "${caption.trim()}"` : ""}
${keywords.trim() ? `- Focus Keywords: "${keywords.trim()}"` : ""}

REQUIREMENTS:
- Every hashtag must start with '#' followed by alphanumeric characters only (no spaces, punctuation, emojis).
- Format hashtags using clean PascalCase (e.g. #StreetPhotography, #FoodStyling, #OOTD).
- No duplicates across categories.
- Output MUST be strictly valid JSON matching this exact structure:
{
  "detectedSummary": "Engaging caption for the image post...",
  "categories": {
    "trending": ["#tag1", "#tag2"],
    "niche": ["#tag3", "#tag4"],
    "topic": ["#tag5", "#tag6"]
  },
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "metrics": {
    "#tag1": { "volume": "1.5M", "reach": "High", "difficulty": "Hard" }
  }
}`;
    } else {
      prompt = `You are a world-class social media strategist and SEO expert specializing in hashtag discovery, algorithmic reach, and engagement optimization.

TASK:
Analyze the post content below, understand its core themes, emotional tone, audience, and semantic meaning, and generate a total of approximately ${targetCount} hashtags categorized into 3 strategic tiers:
1. "trending": High-volume, broad discovery, viral/trending hashtags related to the theme.
2. "niche": Community-specific, targeted, medium-competition hashtags with high engagement intent.
3. "topic": Exact content-specific, category, and keyword hashtags describing the specific subject matter.

Also generate estimated metrics for each hashtag ("volume", "reach", "difficulty").

POST DETAILS:
- Target Platform: ${platform}
- Target Hashtag Count: Approximately ${targetCount} total hashtags distributed across the 3 categories
- Selected Tone / Vibe: ${tone}
- Platform Strategy Guidelines: ${targetGuideline}
- Post Caption: "${caption.trim()}"
${keywords?.trim() ? `- Additional Focus Keywords / Niche Context: "${keywords.trim()}"` : ""}

REQUIREMENTS:
1. Understand semantic context deeply.
2. Tailor for ${platform} in "${tone}" tone.
3. Every hashtag starts with '#', alphanumeric characters only.
4. Format with clean PascalCase.
5. No duplicates.
6. Return output as valid JSON matching this exact structure:
{
  "categories": {
    "trending": ["#tag1", "#tag2"],
    "niche": ["#tag3", "#tag4"],
    "topic": ["#tag5", "#tag6"]
  },
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "metrics": {
    "#tag1": { "volume": "1.2M", "reach": "High", "difficulty": "Hard" }
  }
}`;
    }

    const parts: Array<{
      text?: string;
      inline_data?: { mime_type: string; data: string };
    }> = [{ text: prompt }];

    // Attach keyframe images if provided
    if (hasKeyframes) {
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
    } else if (hasVideoData && videoData) {
      parts.push({
        inline_data: {
          mime_type: videoData.mimeType,
          data: videoData.base64.replace(/^data:[^;]+;base64,/, ""),
        },
      });
    }

    // Attach image data if provided
    if (hasImages) {
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

    const requestPayload = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.7,
        response_mime_type: "application/json",
      },
    };

    // Attempt generation with active Gemini models in 2026
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
          lastError =
            errData?.error?.message ||
            `HTTP ${resp.status}: ${resp.statusText}`;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    const cleanTagList = (list: unknown[]): string[] =>
      [
        ...new Set(
          list
            .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
            .filter(Boolean)
            .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
            .map((tag) => tag.replace(/[^a-zA-Z0-9_#]/g, ""))
            .filter((tag) => tag.length > 1)
        ),
      ];

    let trendingTags: string[] = [];
    let nicheTags: string[] = [];
    let topicTags: string[] = [];
    let allHashtags: string[] = [];
    let detectedSummary: string | null = null;
    let metrics: Record<
      string,
      { volume: string; reach: string; difficulty: string }
    > = {};

    if (geminiResponse && geminiResponse.ok) {
      const data = await geminiResponse.json();
      const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      try {
        const parsed = JSON.parse(rawText);
        if (parsed.detectedSummary && typeof parsed.detectedSummary === "string") {
          detectedSummary = parsed.detectedSummary.trim();
        }

        if (parsed.categories && typeof parsed.categories === "object") {
          if (Array.isArray(parsed.categories.trending)) {
            trendingTags = cleanTagList(parsed.categories.trending);
          }
          if (Array.isArray(parsed.categories.niche)) {
            nicheTags = cleanTagList(parsed.categories.niche);
          }
          if (Array.isArray(parsed.categories.topic)) {
            topicTags = cleanTagList(parsed.categories.topic);
          }
        }

        if (Array.isArray(parsed.hashtags)) {
          allHashtags = cleanTagList(parsed.hashtags);
        }

        if (parsed.metrics && typeof parsed.metrics === "object") {
          metrics = parsed.metrics;
        }
      } catch {
        const matches = rawText.match(/#[a-zA-Z0-9_]+/g);
        if (matches) {
          allHashtags = cleanTagList(matches);
        }
      }
    } else {
      console.warn("Gemini request failed, using semantic fallback. Error:", lastError);
      // Smart Semantic Heuristic Generator (Fallback when API key is invalid or quota reached)
      const baseSeed = isVideoMode
        ? `video reel shorts clip ${caption} ${keywords}`
        : `${caption} ${keywords}`;

      const words = baseSeed
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2);

      const capitalizedWords = words.map(
        (w) => w.charAt(0).toUpperCase() + w.slice(1)
      );

      const platformSuffixes: Record<string, string[]> = {
        Instagram: ["Reels", "InstaGood", "ExplorePage", "ViralReels", "DailyPost"],
        YouTube: ["Shorts", "YouTubeCreator", "VideoTrending", "Subscribe", "Vlog"],
        LinkedIn: ["Professional", "Networking", "CareerGrowth", "Leadership", "BusinessStrategy"],
        X: ["Trending", "Breaking", "Community", "HotTopic", "Updates"],
        TikTok: ["FYP", "TikTokViral", "ForYouPage", "TikTokTrend", "TikTokCreator"],
      };

      const tonePrefixes: Record<string, string[]> = {
        "Viral & Engaging": ["Viral", "Trending", "MustWatch", "Explore", "ForYouPage"],
        "Professional & B2B": ["IndustryLeaders", "BusinessInsights", "Strategy", "Innovation", "ThoughtLeadership"],
        "Aesthetic & Lifestyle": ["AestheticVibes", "MoodBoard", "LifestyleDaily", "VisualStory", "CreativeGram"],
        "Niche & Targeted": ["CommunityFirst", "Authentic", "Specifics", "DirectFocus", "TargetedAudience"],
      };

      const platformList = platformSuffixes[platform] || platformSuffixes.Instagram;
      const toneList = tonePrefixes[tone] || tonePrefixes["Viral & Engaging"];

      // Generate contextually relevant categorized tags
      const generatedTrending = [
        ...capitalizedWords.map((w) => `#${w}Trending`),
        ...capitalizedWords.map((w) => `#${w}Viral`),
        ...toneList.map((t) => `#${t}`),
        `#${platform}Trending`,
        isVideoMode ? "#VideoOfTheDay" : "#DailyTrending",
      ];

      const generatedNiche = [
        ...capitalizedWords.map((w) => `#${w}Lovers`),
        ...capitalizedWords.map((w) => `#${w}Community`),
        ...capitalizedWords.map((w) => `#${w}Daily`),
        ...capitalizedWords.map((w) => `#Best${w}`),
        isVideoMode ? "#CreatorsOfInsta" : "#SpecificsHub",
      ];

      const generatedTopic = [
        ...capitalizedWords.map((w) => `#${w}`),
        ...platformList.map((p) => `#${p}`),
        isVideoMode ? "#VideoContent" : "#OriginalPost",
      ];

      const perCatCount = Math.max(2, Math.ceil(targetCount / 3));
      trendingTags = cleanTagList(generatedTrending).slice(0, perCatCount);
      nicheTags = cleanTagList(generatedNiche).slice(0, perCatCount);
      topicTags = cleanTagList(generatedTopic).slice(0, perCatCount);
      allHashtags = cleanTagList([...trendingTags, ...nicheTags, ...topicTags]).slice(0, targetCount);

      if (isVideoMode) {
        detectedSummary =
          "✨ Captivating visual moments captured on camera! Highlighting the best scenes and dynamic energy.";
      }
    }

    // Assemble and normalize
    if (allHashtags.length === 0) {
      allHashtags = [
        ...new Set([...trendingTags, ...nicheTags, ...topicTags]),
      ];
    }

    if (
      trendingTags.length === 0 &&
      nicheTags.length === 0 &&
      topicTags.length === 0 &&
      allHashtags.length > 0
    ) {
      const chunkSize = Math.ceil(allHashtags.length / 3);
      trendingTags = allHashtags.slice(0, chunkSize);
      nicheTags = allHashtags.slice(chunkSize, chunkSize * 2);
      topicTags = allHashtags.slice(chunkSize * 2);
    }

    // Fill missing metrics if needed
    for (const tag of allHashtags) {
      if (!metrics[tag]) {
        if (trendingTags.includes(tag)) {
          metrics[tag] = {
            volume: `${(Math.random() * 2 + 1).toFixed(1)}M`,
            reach: "High",
            difficulty: "Hard",
          };
        } else if (nicheTags.includes(tag)) {
          metrics[tag] = {
            volume: `${Math.floor(Math.random() * 400 + 100)}K`,
            reach: "Medium",
            difficulty: "Medium",
          };
        } else {
          metrics[tag] = {
            volume: `${Math.floor(Math.random() * 90 + 10)}K`,
            reach: "Low",
            difficulty: "Easy",
          };
        }
      }
    }

    return NextResponse.json({
      hashtags: allHashtags,
      categories: {
        trending: trendingTags,
        niche: nicheTags,
        topic: topicTags,
      },
      metrics,
      detectedSummary,
      platform,
      count: allHashtags.length,
      fallbackUsed: !geminiResponse || !geminiResponse.ok,
    });
  } catch (error: unknown) {
    console.error("Error in /api/generate:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
