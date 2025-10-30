import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CategoryProvider } from '@/contexts/CategoryContext'
import ScrollToTop from '@/components/ScrollToTop'
import Index from '@/pages/Index'
import CategoriesArtisans from '@/pages/CategoriesArtisans'
import ArtisanProfile from '@/pages/ArtisanProfile'
import Login from '@/pages/Login'
import RegisterArtisan from '@/pages/RegisterArtisan'
import RegisterStudent from '@/pages/RegisterStudent'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminUsers from '@/pages/admin/AdminUsers'

function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<CategoriesArtisans />} />
            <Route path="/artisans" element={<CategoriesArtisans />} />
            <Route path="/artisan/:id" element={<ArtisanProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/artisan" element={<RegisterArtisan />} />
            <Route path="/register/etudiant" element={<RegisterStudent />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Router>
      </CategoryProvider>
    </AuthProvider>
  )
}

export default App
