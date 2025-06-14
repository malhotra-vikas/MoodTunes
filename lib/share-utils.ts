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

export function generateShareText(analysis: MoodAnalysis): string {
  const topSongs = analysis.songs.slice(0, 3)
  const songList = topSongs.map((song) => `🎵 ${song.title} - ${song.artist}`).join("\n")

  return `🎭 My mood: ${analysis.mood} (${analysis.intensity}/10)
💭 Emotions: ${analysis.emotions.slice(0, 3).join(", ")}

🎶 My AI-curated playlist:
${songList}

Discover your perfect soundtrack at MoodTunes! 🎧✨`
}

export function generateShareUrl(): string {
  return typeof window !== "undefined" ? window.location.origin : ""
}

export function shareToTwitter(text: string, url: string): void {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, "_blank", "width=550,height=420")
}

export function shareToFacebook(url: string): void {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, "_blank", "width=580,height=296")
}

export function shareToWhatsApp(text: string): void {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, "_blank")
}

export function shareToLinkedIn(text: string, url: string): void {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
  window.open(linkedinUrl, "_blank", "width=520,height=570")
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy text: ", err)
    return false
  }
}
