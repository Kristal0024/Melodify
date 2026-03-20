import { useNavigate } from 'react-router-dom'

const AlbumArtIcon = () => (
  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="2" x2="12" y2="9"/>
    <line x1="12" y1="15" x2="12" y2="22"/>
  </svg>
)

export default function AlbumCard({ album }) {
  const navigate = useNavigate()

  return (
    <div className="album-card" onClick={() => navigate(`/albums/${album._id}`)} id={`album-${album._id}`}>
      <div className="album-art">
        <AlbumArtIcon />
      </div>
      <div className="album-card-title">{album.title}</div>
      <div className="album-card-artist">{album.artist?.username || 'Unknown Artist'}</div>
      <div className="album-card-count">{album.musics?.length || 0} songs</div>
    </div>
  )
}
