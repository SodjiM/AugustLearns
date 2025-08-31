import { useEffect, useState } from 'react'
import { registerUiBus } from '../../../../uiBridge'
import { Celebration } from '../../../../components/Celebration'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const COLORS = ['#ef4444','#f97316','#f59e0b','#22c55e','#3b82f6','#6366f1','#a855f7']

export function ABCSingAlong() {
  const [started, setStarted] = useState(false)
  const [lit, setLit] = useState<boolean[]>(() => Array(26).fill(false))
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [celebrated, setCelebrated] = useState(false)

  const onReset = () => { setStarted(false); setLit(Array(26).fill(false)); setCelebrated(false) }

  const finished = started && lit.every(Boolean)

  useEffect(() => {
    registerUiBus({
      abcsMarkLetter: (letter: string) => {
        const i = LETTERS.indexOf(letter.toUpperCase())
        if (i >= 0) {
          setStarted(true)
          setLit((prev) => { const a = [...prev]; a[i] = true; return a })
        }
      },
      abcsReset: () => onReset(),
      triggerCelebrate: () => setShowCelebrate(true)
    })
  }, [])

  useEffect(() => {
    if (finished && !celebrated) {
      setShowCelebrate(true)
      setCelebrated(true)
    }
  }, [finished, celebrated])

  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <div className="text-lg font-bold">ABC's Sing-Along</div>
          <div className="text-xs text-slate-500">Sing together and watch the letters light up!</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-slate-200" onClick={onReset}>Reset</button>
        </div>
      </div>
      <div className="p-6 overflow-auto">
        {showCelebrate && <Celebration onDone={() => { setShowCelebrate(false); onReset() }} />}
        <div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-2 place-items-center">
          {LETTERS.map((ch, i) => {
            const active = started && !!lit[i]
            const color = COLORS[i % COLORS.length]
            return (
              <div key={ch} className={`w-14 h-14 md:w-16 md:h-16 rounded-xl grid place-items-center border text-2xl font-black transition-all ${active ? '' : 'opacity-40'}`} style={{ backgroundColor: active ? color : '#fff', color: active ? 'white' : '#475569', borderColor: active ? color : '#e2e8f0' }}>
                {ch}
              </div>
            )
          })}
        </div>
        {finished && (
          <div className="mt-6 text-center text-2xl font-bold text-emerald-600">Great job! You sang all the way to Z! 🎉</div>
        )}
        {!started && (
          <div className="mt-6 text-center text-slate-500">Tap Start Visuals and begin singing "A B C..." — I’ll follow along!</div>
        )}
      </div>
    </div>
  )
}


