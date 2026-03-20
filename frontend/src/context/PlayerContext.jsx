import { createContext, useContext, useState, useRef, useCallback } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef(new Audio())

  const play = useCallback((track) => {
    const audio = audioRef.current
    if (currentTrack?._id === track._id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false) }
      else { audio.play(); setIsPlaying(true) }
      return
    }
    audio.src = track.uri
    audio.volume = volume
    audio.play()
    setCurrentTrack(track)
    setIsPlaying(true)

    audio.ontimeupdate = () => setProgress(audio.currentTime)
    audio.ondurationchange = () => setDuration(audio.duration)
    audio.onended = () => setIsPlaying(false)
  }, [currentTrack, isPlaying, volume])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play(); setIsPlaying(true) }
  }, [isPlaying])

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time
    setProgress(time)
  }, [])

  const changeVolume = useCallback((v) => {
    audioRef.current.volume = v
    setVolume(v)
  }, [])

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, progress, duration, volume, play, togglePlay, seek, changeVolume }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
