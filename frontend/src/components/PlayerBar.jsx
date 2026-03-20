import { usePlayer } from '../context/PlayerContext'

const PlayIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const PauseIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
  </svg>
)
const MusicNoteIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
)
const VolumeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 010 7.07"/>
    <path d="M19.07 4.93a10 10 0 010 14.14"/>
  </svg>
)

function fmt(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function PlayerBar() {
  const { currentTrack, isPlaying, progress, duration, volume, togglePlay, seek, changeVolume } = usePlayer()

  return (
    <div className="player-bar">
      {currentTrack ? (
        <>
          {/* Track info */}
          <div className="player-track-info">
            <div className="player-thumb"><MusicNoteIcon /></div>
            <div>
              <div className="player-title">{currentTrack.title}</div>
              <div className="player-artist">{currentTrack.artist?.username || 'Unknown Artist'}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="player-controls">
            <div className="player-buttons">
              <button className="btn-play-pause" onClick={togglePlay} id="player-toggle">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>

            <div className="progress-row">
              <span className="time-label">{fmt(progress)}</span>
              <input
                type="range"
                className="progress-bar"
                min={0} max={duration || 1} step={0.1}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
              />
              <span className="time-label right">{fmt(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="player-volume">
            <VolumeIcon />
            <input
              type="range"
              className="volume-slider"
              min={0} max={1} step={0.01}
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
            />
          </div>
        </>
      ) : (
        <div className="player-empty">
          <MusicNoteIcon />
          <span>Select a song to start listening</span>
        </div>
      )}
    </div>
  )
}
