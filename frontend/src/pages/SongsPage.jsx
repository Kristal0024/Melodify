import { useEffect, useState } from 'react'
import api from '../api/axios'
import SongCard from '../components/SongCard'
import toast from 'react-hot-toast'

const MusicIcon = () => (
  <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
)

export default function SongsPage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/music')
      .then(res => { setSongs(res.data.musics || []); setLoading(false) })
      .catch(() => { toast.error('Failed to load songs'); setLoading(false) })
  }, [])

  return (
    <div>
      <h1 className="page-title">All Songs</h1>
      <p className="page-subtitle">{songs.length} tracks available</p>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : songs.length === 0 ? (
        <div className="empty-state">
          <MusicIcon />
          <p>No songs yet.</p>
        </div>
      ) : (
        <>
          <div className="song-list-header">
            <span>#</span><span>Title</span><span></span>
          </div>
          <div className="song-list">
            {songs.map((song, i) => (
              <SongCard key={song._id} song={song} index={i} songs={songs} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
