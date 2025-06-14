"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Loader2 } from "lucide-react"
import { useMusicPlayer } from "@/contexts/music-player-context"

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function MusicPlayer() {
  const { currentSong, isPlaying, volume, isLoading, togglePlayPause, nextSong, previousSong, setVolume, playerRef } =
    useMusicPlayer()

  const [isMuted, setIsMuted] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        setIsPlayerReady(true)
      }
    } else {
      setIsPlayerReady(true)
    }
  }, [])

  useEffect(() => {
    if (isPlayerReady && currentSong?.youtubeId && !playerRef.current) {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: currentSong.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            playerRef.current.setVolume(volume)
          },
          onStateChange: (event: any) => {
            // Handle player state changes if needed
          },
        },
      })
    } else if (playerRef.current && currentSong?.youtubeId) {
      playerRef.current.loadVideoById(currentSong.youtubeId)
    }
  }, [isPlayerReady, currentSong, volume])

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(50)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  if (!currentSong) {
    return null
  }

  return (
    <>
      {/* Hidden YouTube Player */}
      <div id="youtube-player" style={{ display: "none" }}></div>

      {/* Music Player UI */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="max-w-4xl mx-auto bg-black/80 backdrop-blur-lg border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Song Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Music className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold truncate">{currentSong.title}</h3>
                  <p className="text-gray-300 text-sm truncate">{currentSong.artist}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button onClick={previousSong} size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  onClick={togglePlayPause}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-10 h-10 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <Button onClick={nextSong} size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="hidden md:flex items-center gap-2 w-32">
                <Button onClick={toggleMute} size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
