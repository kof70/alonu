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
import MesInscriptions from '@/pages/etudiant/MesInscriptions'
import Disponibilites from '@/pages/etudiant/Disponibilites'
import MonArtisan from '@/pages/etudiant/MonArtisan'
// Demo supprimé en production
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminUsers from '@/pages/admin/AdminUsers'
import ArtisansPage from '@/pages/admin/artisans/ArtisansPage'
import MesEtudiantsPage from '@/pages/admin/artisans/MesEtudiantsPage'
import StudentInscriptionsPage from '@/pages/admin/students/StudentInscriptionsPage'
import FloatingCategoryButton from '@/components/FloatingCategoryButton'

function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            {false && <Route path="/demo" element={null} />}
            <Route path="/categories" element={<CategoriesArtisans />} />
            <Route path="/artisans" element={<CategoriesArtisans />} />
            <Route path="/artisan/:id" element={<ArtisanProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/artisan" element={<RegisterArtisan />} />
            <Route path="/register/etudiant" element={<RegisterStudent />} />
            <Route path="/mes-inscriptions" element={<MesInscriptions />} />
            <Route path="/etudiant/inscriptions" element={<MesInscriptions />} />
            <Route path="/etudiant/disponibilites" element={<Disponibilites />} />
            <Route path="/etudiant/mon-artisan" element={<MonArtisan />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="artisans" element={<ArtisansPage />} />
              <Route path="artisans/mes-etudiants" element={<MesEtudiantsPage />} />
              <Route path="etudiants/inscriptions" element={<StudentInscriptionsPage />} />
            </Route>
            {/* Alias pour compatibilité ancienne URL */}
            <Route path="/register-student" element={<RegisterStudent />} />
          </Routes>
          <FloatingCategoryButton />
        </Router>
      </CategoryProvider>
    </AuthProvider>
  )
}

export default App
