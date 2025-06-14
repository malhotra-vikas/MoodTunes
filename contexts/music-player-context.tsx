"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useCallback } from "react"

interface Song {
  title: string
  artist: string
  reason: string
  youtubeId?: string
}

interface MusicPlayerContextType {
  currentSong: Song | null
  isPlaying: boolean
  playlist: Song[]
  currentIndex: number
  volume: number
  isLoading: boolean
  setPlaylist: (songs: Song[]) => void
  playSong: (song: Song, index: number) => void
  togglePlayPause: () => void
  nextSong: () => void
  previousSong: () => void
  setVolume: (volume: number) => void
  playerRef: React.RefObject<any>
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylistState] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [volume, setVolumeState] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const playerRef = useRef<any>(null)

  const setPlaylist = useCallback((songs: Song[]) => {
    setPlaylistState(songs)
    setCurrentIndex(0)
  }, [])

  const playSong = useCallback(async (song: Song, index: number) => {
    setIsLoading(true)
    setCurrentSong(song)
    setCurrentIndex(index)

    // If YouTube ID is already available, play immediately
    if (song.youtubeId) {
      console.log(`Playing song with pre-loaded ID: ${song.youtubeId}`)
      setIsLoading(false)
      setIsPlaying(true)
      return
    }

    // Fallback: search for the song if no ID is available (shouldn't happen with new system)
    try {
      const searchQuery = `${song.title} ${song.artist} official audio`
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.videoId) {
        song.youtubeId = data.videoId
        console.log(`Found YouTube ID via fallback search: ${data.videoId}`)
      }
    } catch (error) {
      console.error("Error searching for song:", error)
    }

    setIsLoading(false)
    setIsPlaying(true)
  }, [])

  const togglePlayPause = useCallback(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const nextSong = useCallback(() => {
    if (playlist.length > 0) {
      const nextIndex = (currentIndex + 1) % playlist.length
      playSong(playlist[nextIndex], nextIndex)
    }
  }, [playlist, currentIndex, playSong])

  const previousSong = useCallback(() => {
    if (playlist.length > 0) {
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
      playSong(playlist[prevIndex], prevIndex)
    }
  }, [playlist, currentIndex, playSong])

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }, [])

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playlist,
        currentIndex,
        volume,
        isLoading,
        setPlaylist,
        playSong,
        togglePlayPause,
        nextSong,
        previousSong,
        setVolume,
        playerRef,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider")
  }
  return context
}
