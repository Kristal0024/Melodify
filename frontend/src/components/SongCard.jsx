import { usePlayer } from '../context/PlayerContext'

const PlayIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const SpeakerIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path stroke="currentColor" strokeWidth="2" d="M15.54 8.46a5 5 0 010 7.07"/>
  </svg>
)

export default function SongCard({ song, index, songs }) {
  const { currentTrack, isPlaying, play } = usePlayer()
  const isCurrentlyPlaying = currentTrack?._id === song._id && isPlaying

  return (
    <div
      className={`song-row${isCurrentlyPlaying ? ' playing' : ''}`}
      onClick={() => play(song)}
      id={`song-${song._id}`}
    >
      <div className={`song-num${isCurrentlyPlaying ? ' playing' : ''}`}>
        {isCurrentlyPlaying ? <SpeakerIcon /> : (index + 1)}
      </div>
      <div className="song-info-text">
        <div className="song-title">{song.title}</div>
        <div className="song-artist">{song.artist?.username || 'Unknown Artist'}</div>
      </div>
      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); play(song) }}>
        {isCurrentlyPlaying ? <SpeakerIcon /> : <PlayIcon />}
      </button>
    </div>
  )
}
