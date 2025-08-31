import { useEffect, useMemo, useState } from 'react'
import { registerUiBus } from '../../../../uiBridge'
import type { BarnAnimal } from '../animals'

type MarkState = { nameCorrect?: boolean; soundCorrect?: boolean }

export function BarnAnimals() {
  const [animal, setAnimal] = useState<BarnAnimal | null>(null)
  const [revealed, setRevealed] = useState<{ name?: boolean; sound?: boolean }>({})
  const [mark, setMark] = useState<MarkState>({})
  const [round, setRound] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const allCorrect = useMemo(() => (mark.nameCorrect && mark.soundCorrect) === true, [mark])

  useEffect(() => {
    registerUiBus({
      barnSetAnimal: (a: BarnAnimal) => { setAnimal(a); setRevealed({}); setMark({}); setRound(r => r + 1) },
      barnReveal: (opts: { name?: boolean; sound?: boolean }) => setRevealed((prev) => ({ ...prev, ...opts })),
      barnMark: (m: MarkState) => setMark((prev) => ({ ...prev, ...m })),
      barnReset: () => { setAnimal(null); setRevealed({}); setMark({}); setRound(0) },
      barnCelebrate: () => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1800) }
    })
  }, [])

  const onNextClick = () => {
    try {
      (window as any)?.oaiSession?.callTool?.('barn_next', {})
    } catch {}
  }

  const onRevealClick = () => {
    try {
      (window as any)?.oaiSession?.callTool?.('barn_reveal', { name: true, sound: true })
    } catch {}
  }

  const onReset = () => {
    try { (window as any)?.oaiSession?.callTool?.('barn_reset', {}) } catch {}
  }

  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <div className="text-lg font-bold">Barn Animals</div>
          <div className="text-xs text-slate-500">Name them and make their sounds!</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-slate-200" onClick={onReset}>Reset</button>
          <button className="px-3 py-1 rounded bg-slate-200" onClick={onRevealClick} disabled={!animal}>Reveal</button>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={onNextClick}>Next animal</button>
        </div>
      </div>
      <div className="p-6 h-full grid place-items-center">
        <div className="w-full max-w-md">
          <div className="text-center text-xs text-slate-400 mb-2">Round {round}</div>
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            {animal ? (
              <div className="space-y-4">
                <div className="text-7xl text-center" aria-label={animal.name}>{animal.emoji}</div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Animal" value={revealed.name ? capitalize(animal.name) : '???'} correct={mark.nameCorrect} />
                  <InfoCard label="Sound" value={revealed.sound ? prettySound(animal.sound) : '???'} correct={mark.soundCorrect} />
                </div>
                {allCorrect && (
                  <div className="text-center text-emerald-600 font-semibold">Great job! You got both right!</div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500">Press Next animal or say "show me a barn animal".</div>
            )}
          </div>
        </div>
        {showConfetti && <Confetti />}
      </div>
    </div>
  )
}

function InfoCard({ label, value, correct }: { label: string; value: string; correct?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${correct === true ? 'border-emerald-400 bg-emerald-50' : correct === false ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      {correct === true && <div className="text-xs text-emerald-600">Correct</div>}
      {correct === false && <div className="text-xs text-rose-600">Try again</div>}
    </div>
  )
}

function capitalize(s: string) { return s.slice(0,1).toUpperCase() + s.slice(1) }
function prettySound(s: string) { return s.split('-').map(capitalize).join('-') }

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none grid place-items-center">
      <div className="text-5xl animate-bounce">🎉</div>
    </div>
  )
}

