"use server"

import { z } from "zod"

const MoodAnalysisSchema = z.object({
  mood: z.string(),
  intensity: z.number().min(1).max(10),
  emotions: z.array(z.string()),
  songs: z.array(
    z.object({
      title: z.string(),
      artist: z.string(),
      reason: z.string(),
    })
  ),
})

async function searchYouTubeVideo(query: string): Promise<string | null> {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
    console.log(`[YouTube Search] Query: ${query}`)

    if (!YOUTUBE_API_KEY) {
      console.warn(`[YouTube Search] No API key found. Using fallback list.`)
      const fallbackVideos = [
        "dQw4w9WgXcQ", "kJQP7kiw5Fk", "fJ9rUzIMcZQ", "9bZkp7q19f0",
        "hT_nvWreIhg", "YQHsXMglC9A", "JGwWNGJdvx8", "CevxZvSJLk8",
        "nfWlot6h_JM", "pRpeEdMmmQ0"
      ]
      let hash = 0
      for (let i = 0; i < query.length; i++) {
        hash = (hash << 5) - hash + query.charCodeAt(i)
        hash |= 0
      }
      const fallbackId = fallbackVideos[Math.abs(hash) % fallbackVideos.length]
      console.log(`[YouTube Search] Fallback video ID: ${fallbackId}`)
      return fallbackId
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    )

    const data = await response.json()
    console.log(`[YouTube Search] API response:`, data)

    if (data.items && data.items.length > 0) {
      const id = data.items[0].id.videoId
      console.log(`[YouTube Search] Found video ID: ${id}`)
      return id
    }

    console.warn(`[YouTube Search] No items found in YouTube response.`)
    return null
  } catch (err) {
    console.error(`[YouTube Search] Error:`, err)
    return null
  }
}

const getMockResponse = async (text: string) => {
  console.log(`[Mock Data] Generating mock response for text: ${text}`)
  const moods = ["happy", "melancholic", "energetic", "calm", "nostalgic", "romantic"]
  const mood = moods[Math.floor(Math.random() * moods.length)]

  const mockSongs: Record<string, Array<{ title: string; artist: string; reason: string }>> = {
    happy: [
      { title: "Happy", artist: "Pharrell", reason: "Feel-good vibe" },
      { title: "Good as Hell", artist: "Lizzo", reason: "Empowering" },
      { title: "Can’t Stop the Feeling!", artist: "Justin Timberlake", reason: "Uplifting" },
      { title: "Walking on Sunshine", artist: "Katrina and the Waves", reason: "Sunny mood" },
      { title: "Shake It Off", artist: "Taylor Swift", reason: "Let-it-go vibe" },
    ],
    melancholic: [
      { title: "Mad World", artist: "Gary Jules", reason: "Haunting emotion" },
      { title: "Hurt", artist: "Johnny Cash", reason: "Emotional depth" },
      { title: "Skinny Love", artist: "Bon Iver", reason: "Soft sadness" },
      { title: "Black", artist: "Pearl Jam", reason: "Raw expression" },
      { title: "The Night We Met", artist: "Lord Huron", reason: "Lost love" },
    ],
    // etc...
  }

  const songs = mockSongs[mood] || mockSongs.happy

  const songsWithIds = await Promise.all(
    songs.map(async (song) => {
      const query = `${song.title} ${song.artist} official audio`
      const youtubeId = await searchYouTubeVideo(query)
      return { ...song, youtubeId }
    })
  )

  const mockResult = {
    mood,
    intensity: Math.floor(Math.random() * 6) + 5,
    emotions: ["thoughtful", "reflective"],
    songs: songsWithIds,
  }

  console.log(`[Mock Data] Final mock result:`, mockResult)
  return mockResult
}

export async function analyzeMoodAndRecommendSongs(text: string) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn("[OpenAI] No API key found. Using mock response.")
    const mock = await getMockResponse(text)
    return { success: true, data: mock, isDemo: true }
  }

  try {
    const prompt = `
Analyze the mood and emotions in this text: "${text}"

Based on the detected mood, recommend 5 songs that would resonate with or complement this emotional state.
Include mood, intensity (1-10), emotions, and song recommendations (title, artist, reason).
Respond ONLY in this strict JSON format:

{
  "mood": string,
  "intensity": number (1-10),
  "emotions": string[],
  "songs": [
    {
      "title": string,
      "artist": string,
      "reason": string
    }
  ]
}`

    console.log(`[OpenAI] Sending request to OpenAI with prompt:\n${prompt}`)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })

    const json = await response.json()
    console.log(`[OpenAI] Raw response:`, JSON.stringify(json, null, 2))

    const raw = json.choices?.[0]?.message?.content
    if (!raw) {
      console.warn("[OpenAI] No content in response.")
      throw new Error("No message content")
    }
    const cleaned = raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim()

    let parsedJSON
    try {
      parsedJSON = JSON.parse(cleaned)
      console.log(`[OpenAI] Parsed JSON content:`, parsedJSON)
    } catch (err) {
      console.error(`[OpenAI] JSON parsing failed:`, err)
      throw err
    }

    const parsed = MoodAnalysisSchema.safeParse(parsedJSON)
    if (!parsed.success) {
      console.error("[OpenAI] Validation failed:", parsed.error.format())
      throw new Error("Zod validation failed")
    }

    console.log("[OpenAI] Parsed and validated response:", parsed.data)

    const songsWithIds = await Promise.all(
      parsed.data.songs.map(async (song) => {
        const query = `${song.title} ${song.artist} official audio`
        const youtubeId = await searchYouTubeVideo(query)
        return { ...song, youtubeId }
      })
    )

    const finalData = {
      ...parsed.data,
      songs: songsWithIds,
    }

    console.log(`[Success] Final result with YouTube IDs:`, finalData)

    return {
      success: true,
      data: finalData,
      isDemo: false,
    }
  } catch (err) {
    console.error(`[Fallback] Error occurred, using mock:`, err)
    const mock = await getMockResponse(text)
    return {
      success: true,
      data: mock,
      isDemo: true,
    }
  }
}
