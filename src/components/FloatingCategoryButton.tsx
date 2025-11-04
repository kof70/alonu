import { useNavigate } from 'react-router-dom'

export default function FloatingCategoryButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/categories')}
      className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 z-[60]"
      aria-label="Voir les artisans par catégorie"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      Artisans par Catégorie
    </button>
  )
}



