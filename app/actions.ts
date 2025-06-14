"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const MoodAnalysisSchema = z.object({
  mood: z.string().describe("The primary mood detected from the text"),
  intensity: z.number().min(1).max(10).describe("Intensity of the mood from 1-10"),
  emotions: z.array(z.string()).describe("List of emotions present in the text"),
  songs: z
    .array(
      z.object({
        title: z.string(),
        artist: z.string(),
        reason: z.string().describe("Why this song matches the mood"),
      }),
    )
    .describe("5 song recommendations that match the detected mood"),
})

// Mock data for demonstration when API key is not available
const getMockResponse = (text: string) => {
  const mockMoods = ["happy", "melancholic", "energetic", "calm", "nostalgic", "romantic"]
  const randomMood = mockMoods[Math.floor(Math.random() * mockMoods.length)]

  const mockSongs = {
    happy: [
      { title: "Good as Hell", artist: "Lizzo", reason: "Uplifting and empowering vibes" },
      { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", reason: "Pure joy and positivity" },
      { title: "Happy", artist: "Pharrell Williams", reason: "Classic feel-good anthem" },
      { title: "Walking on Sunshine", artist: "Katrina and the Waves", reason: "Infectious happiness" },
      { title: "I Got You (I Feel Good)", artist: "James Brown", reason: "Timeless celebration of joy" },
    ],
    melancholic: [
      { title: "Mad World", artist: "Gary Jules", reason: "Haunting and introspective" },
      { title: "The Night We Met", artist: "Lord Huron", reason: "Perfect for reflective moments" },
      { title: "Skinny Love", artist: "Bon Iver", reason: "Beautiful melancholy" },
      { title: "Hurt", artist: "Johnny Cash", reason: "Deep emotional resonance" },
      { title: "Black", artist: "Pearl Jam", reason: "Raw emotional expression" },
    ],
    energetic: [
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", reason: "High-energy dance vibes" },
      { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", reason: "Motivational and pumping" },
      { title: "Thunder", artist: "Imagine Dragons", reason: "Electrifying energy" },
      { title: "Pump It", artist: "The Black Eyed Peas", reason: "Gets you moving" },
      { title: "Eye of the Tiger", artist: "Survivor", reason: "Ultimate motivation anthem" },
    ],
    calm: [
      { title: "Weightless", artist: "Marconi Union", reason: "Scientifically designed to reduce anxiety" },
      { title: "River", artist: "Joni Mitchell", reason: "Peaceful and soothing" },
      { title: "Clair de Lune", artist: "Claude Debussy", reason: "Classical tranquility" },
      { title: "Mad About You", artist: "Sting", reason: "Gentle and calming" },
      { title: "The Night We Met", artist: "Lord Huron", reason: "Soft and contemplative" },
    ],
    nostalgic: [
      { title: "The Way You Look Tonight", artist: "Frank Sinatra", reason: "Timeless romantic nostalgia" },
      { title: "Yesterday", artist: "The Beatles", reason: "Classic reflection on the past" },
      { title: "Summer Breeze", artist: "Seals and Crofts", reason: "Warm memories of simpler times" },
      { title: "The Sound of Silence", artist: "Simon & Garfunkel", reason: "Contemplative and nostalgic" },
      { title: "Vincent (Starry Starry Night)", artist: "Don McLean", reason: "Beautiful tribute to memories" },
    ],
    romantic: [
      { title: "At Last", artist: "Etta James", reason: "Timeless romantic classic" },
      { title: "Perfect", artist: "Ed Sheeran", reason: "Modern love ballad" },
      { title: "La Vie En Rose", artist: "Édith Piaf", reason: "French romantic elegance" },
      { title: "All of Me", artist: "John Legend", reason: "Heartfelt dedication" },
      { title: "Make You Feel My Love", artist: "Adele", reason: "Powerful romantic expression" },
    ],
  }

  return {
    mood: randomMood,
    intensity: Math.floor(Math.random() * 6) + 5, // 5-10 for demo
    emotions: ["contemplative", "reflective", "peaceful"].slice(0, Math.floor(Math.random() * 3) + 1),
    songs: mockSongs[randomMood as keyof typeof mockSongs] || mockSongs.happy,
  }
}

export async function analyzeMoodAndRecommendSongs(text: string) {
  try {
    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.log("OpenAI API key not found, using mock response for demonstration")
      // Return mock data for demonstration purposes
      const mockData = getMockResponse(text)
      return {
        success: true,
        data: mockData,
        isDemo: true,
      }
    }

    // Configure OpenAI client with API key
    const openaiClient = openai({
      apiKey: apiKey,
    })

    const { object } = await generateObject({
      model: openaiClient("gpt-4o"),
      schema: MoodAnalysisSchema,
      prompt: `Analyze the mood and emotions in this text: "${text}"
      
      Based on the detected mood, recommend 5 songs that would resonate with or complement this emotional state. 
      Consider both songs that match the mood and songs that might help improve it if it's negative.
      Include a mix of popular and lesser-known tracks across different genres.
      
      Provide the mood, intensity (1-10), emotions present, and song recommendations with reasons.`,
    })

    return { success: true, data: object, isDemo: false }
  } catch (error) {
    console.error("Error analyzing mood:", error)

    // If there's an API error, fall back to mock data
    console.log("Falling back to mock response due to API error")
    const mockData = getMockResponse(text)
    return {
      success: true,
      data: mockData,
      isDemo: true,
    }
  }
}
