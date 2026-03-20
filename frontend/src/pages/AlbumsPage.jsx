import { useEffect, useState } from 'react'
import api from '../api/axios'
import AlbumCard from '../components/AlbumCard'
import toast from 'react-hot-toast'

const AlbumIcon = () => (
  <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/music/albums')
      .then(res => { setAlbums(res.data.albums || []); setLoading(false) })
      .catch(() => { toast.error('Failed to load albums'); setLoading(false) })
  }, [])

  return (
    <div>
      <h1 className="page-title">Albums</h1>
      <p className="page-subtitle">Explore artist collections</p>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : albums.length === 0 ? (
        <div className="empty-state">
          <AlbumIcon />
          <p>No albums yet. Artists can create albums from the dashboard.</p>
        </div>
      ) : (
        <div className="card-grid">
          {albums.map(album => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  )
}
