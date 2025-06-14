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
  const [playerState, setPlayerState] = useState<string>("loading")

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API ready")
        setIsPlayerReady(true)
      }
    } else {
      setIsPlayerReady(true)
    }
  }, [])

  useEffect(() => {
    if (isPlayerReady && currentSong?.youtubeId) {
      if (!playerRef.current) {
        console.log("Creating YouTube player with video:", currentSong.youtubeId)
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
            onReady: (event: any) => {
              console.log("YouTube player ready")
              event.target.setVolume(volume)
              setPlayerState("ready")
            },
            onStateChange: (event: any) => {
              const state = event.data
              if (state === window.YT.PlayerState.ENDED) {
                nextSong()
              } else if (state === window.YT.PlayerState.PLAYING) {
                setPlayerState("playing")
              } else if (state === window.YT.PlayerState.PAUSED) {
                setPlayerState("paused")
              } else if (state === window.YT.PlayerState.BUFFERING) {
                setPlayerState("buffering")
              }
            },
            onError: (event: any) => {
              console.error("YouTube player error:", event.data)
              setPlayerState("error")
              // Try next song on error
              setTimeout(() => nextSong(), 2000)
            },
          },
        })
      } else {
        console.log("Loading new video:", currentSong.youtubeId)
        setPlayerState("loading")
        playerRef.current.loadVideoById(currentSong.youtubeId)
      }
    }
  }, [isPlayerReady, currentSong?.youtubeId, volume, nextSong])

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

  const isActuallyLoading = isLoading || playerState === "loading" || playerState === "buffering"

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
                  {isActuallyLoading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Music className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold truncate">{currentSong.title}</h3>
                  <p className="text-gray-300 text-sm truncate">
                    {currentSong.artist}
                    {playerState === "error" && (
                      <span className="text-red-400 ml-2">(Error loading - trying next song...)</span>
                    )}
                    {isActuallyLoading && <span className="text-blue-400 ml-2">(Loading...)</span>}
                  </p>
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
                  disabled={isActuallyLoading || playerState === "error"}
                >
                  {isActuallyLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying && playerState === "playing" ? (
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
