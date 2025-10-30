import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Espace d’administration</h1>
          <nav className="flex gap-4 text-sm">
            <Link className="text-blue-600 hover:underline" to="/">Accueil</Link>
            <Link className="text-blue-600 hover:underline" to="/admin/users">Utilisateurs</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}


