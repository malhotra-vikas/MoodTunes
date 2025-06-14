"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { analyzeMoodAndRecommendSongs } from "./actions"
import {
  Music,
  Sparkles,
  Heart,
  Brain,
  Loader2,
  Share2,
  Twitter,
  Facebook,
  MessageCircle,
  Linkedin,
  Copy,
  Check,
} from "lucide-react"
import {
  generateShareText,
  generateShareUrl,
  shareToTwitter,
  shareToFacebook,
  shareToWhatsApp,
  shareToLinkedIn,
  copyToClipboard,
} from "@/lib/share-utils"
import { MusicPlayerProvider } from "@/contexts/music-player-context"
import { MusicPlayer } from "@/components/music-player"
import { SongCard } from "@/components/song-card"
import { PlayAllButton } from "@/components/play-all-button"

interface MoodAnalysis {
  mood: string
  intensity: number
  emotions: string[]
  songs: Array<{
    title: string
    artist: string
    reason: string
  }>
}

export default function MoodMusicApp() {
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    startTransition(async () => {
      setError("")
      const result = await analyzeMoodAndRecommendSongs(text)

      if (result.success) {
        setAnalysis(result.data)
        setIsDemoMode(result.isDemo || false)
      } else {
        setError(result.error || "Something went wrong")
      }
    })
  }

  const handleShare = async (platform: string) => {
    if (!analysis) return

    const shareText = generateShareText(analysis)
    const shareUrl = generateShareUrl()

    switch (platform) {
      case "twitter":
        shareToTwitter(shareText, shareUrl)
        break
      case "facebook":
        shareToFacebook(shareUrl)
        break
      case "whatsapp":
        shareToWhatsApp(shareText)
        break
      case "linkedin":
        shareToLinkedIn(shareText, shareUrl)
        break
      case "copy":
        const success = await copyToClipboard(`${shareText}\n\n${shareUrl}`)
        setCopySuccess(success)
        setTimeout(() => setCopySuccess(false), 2000)
        break
    }
  }

  const handleNativeShare = async () => {
    if (!analysis) return

    const shareText = generateShareText(analysis)
    const shareUrl = generateShareUrl()

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My MoodTunes Playlist",
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      happy: "from-yellow-400 to-orange-500",
      sad: "from-blue-400 to-blue-600",
      angry: "from-red-400 to-red-600",
      calm: "from-green-400 to-teal-500",
      excited: "from-purple-400 to-pink-500",
      anxious: "from-gray-400 to-gray-600",
      romantic: "from-pink-400 to-rose-500",
      nostalgic: "from-amber-400 to-orange-600",
      energetic: "from-lime-400 to-green-500",
      melancholic: "from-indigo-400 to-purple-500",
    }

    const lowerMood = mood.toLowerCase()
    for (const [key, value] of Object.entries(moodColors)) {
      if (lowerMood.includes(key)) return value
    }
    return "from-purple-400 to-blue-500"
  }

  return (
    <MusicPlayerProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5"></div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                MoodTunes
              </h1>
            </div>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Share your thoughts and feelings, and let MoodTunes AI discover the perfect soundtrack for your mood
            </p>
          </div>

          {/* Input Form */}
          <Card className="max-w-2xl mx-auto mb-8 bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="mood-text" className="block text-sm font-medium text-white mb-2">
                    How are you feeling today? Share your thoughts...
                  </label>
                  <Textarea
                    id="mood-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="I'm feeling a bit nostalgic today, thinking about old memories and simpler times..."
                    className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                    disabled={isPending}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!text.trim() || isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing mood & preparing songs...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Discover My Music
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">{error}</div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {analysis && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-700">
              {/* Mood Analysis */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-purple-300" />
                    <h2 className="text-2xl font-bold text-white">Mood Analysis</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r ${getMoodColor(analysis.mood)} flex items-center justify-center`}
                      >
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white capitalize">{analysis.mood}</h3>
                      <p className="text-purple-200">Primary Mood</p>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{analysis.intensity}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">Intensity</h3>
                      <p className="text-purple-200">Out of 10</p>
                    </div>

                    <div className="text-center">
                      <div className="flex flex-wrap gap-2 justify-center mb-3">
                        {analysis.emotions.slice(0, 3).map((emotion, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full text-sm text-white border border-white/20"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-white">Emotions</h3>
                      <p className="text-purple-200">Detected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Song Recommendations */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Music className="w-6 h-6 text-purple-300" />
                      <h2 className="text-2xl font-bold text-white">Your Personalized Playlist</h2>
                    </div>
                    <PlayAllButton songs={analysis.songs} />
                  </div>

                  <div className="grid gap-4">
                    {analysis.songs.map((song, index) => (
                      <SongCard key={index} song={song} index={index} songs={analysis.songs} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Share Section */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Share2 className="w-6 h-6 text-purple-300" />
                      <h2 className="text-2xl font-bold text-white">Share Your Vibe</h2>
                    </div>
                    <Button
                      onClick={handleNativeShare}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <p className="text-purple-200 mb-4">
                    Love your personalized playlist? Share your mood and music discoveries with friends!
                  </p>

                  {showShareOptions && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-in fade-in-50 duration-300">
                      <Button
                        onClick={() => handleShare("twitter")}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3"
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="hidden sm:inline">Twitter</span>
                      </Button>

                      <Button
                        onClick={() => handleShare("facebook")}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3"
                      >
                        <Facebook className="w-4 h-4" />
                        <span className="hidden sm:inline">Facebook</span>
                      </Button>

                      <Button
                        onClick={() => handleShare("whatsapp")}
                        className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 py-3"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </Button>

                      <Button
                        onClick={() => handleShare("linkedin")}
                        className="bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center gap-2 py-3"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="hidden sm:inline">LinkedIn</span>
                      </Button>

                      <Button
                        onClick={() => handleShare("copy")}
                        className={`${
                          copySuccess ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 hover:bg-gray-700"
                        } text-white flex items-center justify-center gap-2 py-3 transition-colors duration-200`}
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Preview of shareable content */}
                  {analysis && (
                    <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <h3 className="text-sm font-medium text-purple-300 mb-2">Share Preview:</h3>
                      <div className="text-sm text-white/80 whitespace-pre-line font-mono">
                        {generateShareText(analysis)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <MusicPlayer />
    </MusicPlayerProvider>
  )
}
