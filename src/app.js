const express=require('express')
const cors=require('cors')
const authRoutes=require('./routes/auth.routes')
const cookieParser=require("cookie-parser")
const musicRoutes=require("./routes/music.routes")

const path = require('path')

const app=express()

// CORS - allow frontend dev server and production origin
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// API Routes
app.use('/auth',authRoutes)
app.use('/music',musicRoutes)

// Serve Static Frontend for Deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    // Handle SPA routing: redirect all other requests to index.html
    app.get('(.*)', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

module.exports=app