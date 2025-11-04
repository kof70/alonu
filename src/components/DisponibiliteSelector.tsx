import { useState } from 'react'
import { X } from 'lucide-react'

const DAYS = [
  { key: 'LUN', label: 'Lundi', short: 'L' },
  { key: 'MAR', label: 'Mardi', short: 'M' },
  { key: 'MER', label: 'Mercredi', short: 'M' },
  { key: 'JEU', label: 'Jeudi', short: 'J' },
  { key: 'VEN', label: 'Vendredi', short: 'V' },
  { key: 'SAM', label: 'Samedi', short: 'S' },
  { key: 'DIM', label: 'Dimanche', short: 'D' },
]

const TIME_SLOTS = [
  { label: 'Matin', start: '08:00', end: '12:00' },
  { label: 'Après-midi', start: '14:00', end: '18:00' },
  { label: 'Soir', start: '18:00', end: '22:00' },
  { label: 'Journée complète', start: '08:00', end: '18:00' },
]

interface DisponibiliteSelectorProps {
  joursSemaine: string[]
  onJoursChange: (jours: string[]) => void
  plagesHoraires: Array<{ debut: string; fin: string }>
  onPlagesChange: (plages: Array<{ debut: string; fin: string }>) => void
  mois?: number[]
  onMoisChange?: (mois: number[]) => void
  commentaire?: string
  onCommentaireChange?: (commentaire: string) => void
}

export default function DisponibiliteSelector({
  joursSemaine,
  onJoursChange,
  plagesHoraires,
  onPlagesChange,
  mois = [],
  onMoisChange,
  commentaire = '',
  onCommentaireChange,
}: DisponibiliteSelectorProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>('')

  function toggleJour(key: string) {
    if (joursSemaine.includes(key)) {
      onJoursChange(joursSemaine.filter(k => k !== key))
    } else {
      onJoursChange([...joursSemaine, key])
    }
  }

  function addPlageFromSlot(slot?: { start: string; end: string }) {
    if (slot) {
      onPlagesChange([...plagesHoraires, { debut: slot.start, fin: slot.end }])
    } else if (selectedSlot) {
      const foundSlot = TIME_SLOTS.find(s => `${s.start}-${s.end}` === selectedSlot)
      if (foundSlot) {
        onPlagesChange([...plagesHoraires, { debut: foundSlot.start, fin: foundSlot.end }])
        setSelectedSlot('')
      }
    }
  }

  function addCustomPlage() {
    onPlagesChange([...plagesHoraires, { debut: '', fin: '' }])
  }

  function updatePlage(idx: number, field: 'debut' | 'fin', value: string) {
    onPlagesChange(plagesHoraires.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  function removePlage(idx: number) {
    onPlagesChange(plagesHoraires.filter((_, i) => i !== idx))
  }

  function toggleMois(m: number) {
    if (!onMoisChange) return
    if (mois.includes(m)) {
      onMoisChange(mois.filter(x => x !== m))
    } else {
      onMoisChange([...mois, m])
    }
  }

  return (
    <div className="space-y-6">
      {/* Sélection des jours */}
      <div>
        <label className="block text-sm font-medium mb-3">Jours de disponibilité</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => toggleJour(d.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                joursSemaine.includes(d.key)
                  ? 'text-white'
                  : 'text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              style={joursSemaine.includes(d.key) ? { backgroundColor: '#006E4F' } : {}}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Créneaux horaires rapides */}
      <div>
        <label className="block text-sm font-medium mb-3">Créneaux horaires</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {TIME_SLOTS.map((slot) => (
            <button
              key={`${slot.start}-${slot.end}`}
              type="button"
              onClick={() => addPlageFromSlot(slot)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              {slot.label}<br />
              <span className="text-xs text-gray-600">{slot.start} - {slot.end}</span>
            </button>
          ))}
        </div>
        
        {/* Plages horaires personnalisées */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Plages personnalisées :</span>
            <button type="button" onClick={addCustomPlage} className="text-sm text-[#006E4F] hover:underline">
              + Ajouter une plage
            </button>
          </div>
          {plagesHoraires.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={p.debut}
                onChange={(e) => updatePlage(idx, 'debut', e.target.value)}
              />
              <span>—</span>
              <input
                type="time"
                className="border rounded px-2 py-1"
                value={p.fin}
                onChange={(e) => updatePlage(idx, 'fin', e.target.value)}
              />
              <button type="button" onClick={() => removePlage(idx)} className="text-red-600 hover:text-red-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mois (optionnel) */}
      {onMoisChange && (
        <div>
          <label className="block text-sm font-medium mb-3">Mois préférés (optionnel)</label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
              return (
                <button
                  key={i+1}
                  type="button"
                  onClick={() => toggleMois(i+1)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    mois.includes(i+1)
                      ? 'text-white'
                      : 'text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                  style={mois.includes(i+1) ? { backgroundColor: '#006E4F' } : {}}
                >
                  {monthNames[i]}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Commentaire */}
      {onCommentaireChange && (
        <div>
          <label className="block text-sm font-medium mb-2">Précisions (optionnel)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={commentaire}
            onChange={(e) => onCommentaireChange(e.target.value)}
            placeholder="Ajoutez des précisions sur vos disponibilités..."
          />
        </div>
      )}
    </div>
  )
}

