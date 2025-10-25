import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Index from '@/pages/Index'
import CategoriesArtisans from '@/pages/CategoriesArtisans'
import ArtisanProfile from '@/pages/ArtisanProfile'
import Login from '@/pages/Login'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<CategoriesArtisans />} />
          <Route path="/artisans" element={<CategoriesArtisans />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
