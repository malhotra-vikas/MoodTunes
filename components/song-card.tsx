"use client"

import { Button } from "@/components/ui/button"
import { Music, Play, Pause, Loader2 } from "lucide-react"
import { useMusicPlayer } from "@/contexts/music-player-context"

interface Song {
  title: string
  artist: string
  reason: string
}

interface SongCardProps {
  song: Song
  index: number
  songs: Song[]
}

export function SongCard({ song, index, songs }: SongCardProps) {
  const { currentSong, isPlaying, isLoading, playSong, togglePlayPause, setPlaylist } = useMusicPlayer()

  const isCurrentSong = currentSong?.title === song.title && currentSong?.artist === song.artist
  const isCurrentlyPlaying = isCurrentSong && isPlaying

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlayPause()
    } else {
      setPlaylist(songs)
      playSong(song, index)
    }
  }

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 transform hover:scale-105">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{song.title}</h3>
          <p className="text-purple-200 mb-2">by {song.artist}</p>
          <p className="text-sm text-purple-300 mb-3">{song.reason}</p>

          <Button
            onClick={handlePlay}
            size="sm"
            className={`${
              isCurrentSong
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            } text-white transition-all duration-200`}
            disabled={isLoading && isCurrentSong}
          >
            {isLoading && isCurrentSong ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : isCurrentlyPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {isCurrentSong ? "Resume" : "Play"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
