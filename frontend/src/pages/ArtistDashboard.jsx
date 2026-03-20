import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const UploadIcon = () => (
  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const XIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function ArtistDashboard() {
  const [songs, setSongs] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [songTitle, setSongTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const [albumTitle, setAlbumTitle] = useState('')
  const [selectedSongs, setSelectedSongs] = useState([])
  const [showSongPicker, setShowSongPicker] = useState(false)
  const [creatingAlbum, setCreatingAlbum] = useState(false)

  useEffect(() => {
    api.get('/music')
      .then(res => setSongs(res.data.musics || []))
      .catch(() => {})
  }, [])

  const handleFileChange = (file) => {
    if (!file) return
    if (!file.type.startsWith('audio/')) return toast.error('Please select an audio file')
    setSelectedFile(file)
    if (!songTitle) setSongTitle(file.name.replace(/\.[^/.]+$/, ''))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileChange(file)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return toast.error('Please select a music file')
    if (!songTitle.trim()) return toast.error('Please enter a song title')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('music', selectedFile)
      form.append('title', songTitle)
      const res = await api.post('/music/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success(`"${res.data.music.title}" uploaded!`)
      setSongs(prev => [...prev, res.data.music])
      setSelectedFile(null)
      setSongTitle('')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  const toggleSong = (id) => {
    setSelectedSongs(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleCreateAlbum = async (e) => {
    e.preventDefault()
    if (!albumTitle.trim()) return toast.error('Enter an album title')
    if (selectedSongs.length === 0) return toast.error('Select at least one song')
    setCreatingAlbum(true)
    try {
      await api.post('/music/album', { title: albumTitle, musics: selectedSongs })
      toast.success(`Album "${albumTitle}" created!`)
      setAlbumTitle('')
      setSelectedSongs([])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create album')
    } finally { setCreatingAlbum(false) }
  }

  const getSelectedSongNames = () =>
    songs.filter(s => selectedSongs.includes(s._id)).map(s => s.title)

  return (
    <div>
      <h1 className="page-title">Artist Dashboard</h1>
      <p className="page-subtitle">Upload music and create albums</p>

      <div className="dashboard-grid">
        {/* ── Upload Song ── */}
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: 20 }}>Upload Song</h2>

          <div
            className={`upload-area${dragOver ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('music-file-input').click()}
          >
            <UploadIcon />
            {selectedFile ? (
              <>
                <p style={{ color: 'var(--accent)', fontWeight: 600 }}>{selectedFile.name}</p>
                <span>{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
              </>
            ) : (
              <>
                <p>Drag & drop your audio file here</p>
                <span>or click to browse · MP3, WAV, FLAC</span>
              </>
            )}
          </div>
          <input
            id="music-file-input"
            type="file"
            accept="audio/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e.target.files[0])}
          />

          <form onSubmit={handleUpload} style={{ marginTop: 20 }}>
            <div className="form-group">
              <label className="form-label">Song Title</label>
              <input
                id="song-title-input"
                className="form-input"
                placeholder="Enter song title"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
              />
            </div>
            <button
              id="btn-upload-song"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload Song'}
            </button>
          </form>
        </div>

        {/* ── Create Album ── */}
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: 20 }}>Create Album</h2>
          <form onSubmit={handleCreateAlbum}>
            <div className="form-group">
              <label className="form-label">Album Title</label>
              <input
                id="album-title-input"
                className="form-input"
                placeholder="Enter album title"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Songs in Album</label>
              <div className="music-chips">
                {getSelectedSongNames().map((name, i) => (
                  <span key={i} className="tag">
                    {name}
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', display: 'flex' }}
                      onClick={() => toggleSong(selectedSongs[i])}
                    ><XIcon /></button>
                  </span>
                ))}
                <button
                  type="button"
                  className="chip-add"
                  onClick={() => setShowSongPicker(true)}
                  id="btn-select-songs"
                >
                  <PlusIcon /> Add songs
                </button>
              </div>
            </div>

            <button
              id="btn-create-album"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 12 }}
              disabled={creatingAlbum}
            >
              {creatingAlbum ? 'Creating…' : 'Create Album'}
            </button>
          </form>
        </div>
      </div>

      {/* ── My Uploaded Songs ── */}
      {songs.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 className="section-title">Your Songs</h2>
          <div className="song-list-header">
            <span>#</span><span>Title</span><span></span>
          </div>
          <div className="song-list">
            {songs.map((s, i) => (
              <div key={s._id} className="song-row" style={{ cursor: 'default' }}>
                <div className="song-num">{i + 1}</div>
                <div className="song-info-text">
                  <div className="song-title">{s.title}</div>
                  <div className="song-artist">{s.artist?.username || 'You'}</div>
                </div>
                <span className="tag" style={{ fontSize: 11 }}>Uploaded</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Song Picker Modal ── */}
      {showSongPicker && (
        <div className="select-songs-modal" onClick={() => setShowSongPicker(false)}>
          <div className="select-songs-inner" onClick={(e) => e.stopPropagation()}>
            <h3>Select Songs</h3>
            {songs.length === 0
              ? <p style={{ color: 'var(--text-secondary)' }}>No songs yet. Upload some first.</p>
              : songs.map(s => (
                <label key={s._id} className="select-song-item">
                  <input
                    type="checkbox"
                    className="select-song-checkbox"
                    checked={selectedSongs.includes(s._id)}
                    onChange={() => toggleSong(s._id)}
                  />
                  <span>{s.title}</span>
                </label>
              ))
            }
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: 20, width: '100%' }}
              onClick={() => setShowSongPicker(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
