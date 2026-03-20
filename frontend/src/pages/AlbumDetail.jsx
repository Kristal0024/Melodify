import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import SongCard from '../components/SongCard'
import toast from 'react-hot-toast'

const BackIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const AlbumArtIcon = () => (
  <svg width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function AlbumDetail() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/music/albums/${albumId}`)
      .then(res => { setAlbum(res.data.album); setLoading(false) })
      .catch(() => { toast.error('Failed to load album'); setLoading(false) })
  }, [albumId])

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>
  if (!album) return <div className="empty-state"><p>Album not found.</p></div>

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/albums')}>
        <BackIcon /> Back to Albums
      </button>

      <div className="album-hero">
        <div className="album-hero-art">
          <AlbumArtIcon />
        </div>
        <div>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 8 }}>Album</div>
          <h1 className="album-hero-title">{album.title}</h1>
          <div className="album-hero-meta">
            {album.artist?.username || 'Unknown Artist'} · {album.musics?.length || 0} songs
          </div>
        </div>
      </div>

      <div className="divider" />

      {album.musics?.length === 0 ? (
        <div className="empty-state">
          <p>This album has no songs yet.</p>
        </div>
      ) : (
        <>
          <div className="song-list-header">
            <span>#</span>
            <span>Title</span>
            <span></span>
          </div>
          <div className="song-list">
            {album.musics.map((song, i) => (
              <SongCard key={song._id} song={song} index={i} songs={album.musics} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
