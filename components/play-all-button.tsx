"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useMusicPlayer } from "@/contexts/music-player-context"

interface Song {
  title: string
  artist: string
  reason: string
}

interface PlayAllButtonProps {
  songs: Song[]
}

export function PlayAllButton({ songs }: PlayAllButtonProps) {
  const { playlist, isPlaying, setPlaylist, playSong, togglePlayPause } = useMusicPlayer()

  const isCurrentPlaylist =
    playlist.length === songs.length &&
    playlist.every((song, index) => song.title === songs[index]?.title && song.artist === songs[index]?.artist)

  const handlePlayAll = () => {
    if (isCurrentPlaylist && isPlaying) {
      togglePlayPause()
    } else {
      setPlaylist(songs)
      playSong(songs[0], 0)
    }
  }

  return (
    <Button
      onClick={handlePlayAll}
      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
    >
      {isCurrentPlaylist && isPlaying ? (
        <>
          <Pause className="w-4 h-4 mr-2" />
          Pause All
        </>
      ) : (
        <>
          <Play className="w-4 h-4 mr-2" />
          Play All
        </>
      )}
    </Button>
  )
}
