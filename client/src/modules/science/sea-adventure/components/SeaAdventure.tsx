import { useEffect, useRef, useState } from 'react'
import bgUrl from '../../../../assets/underwater_placeholder.svg'
import { registerUiBus } from '../../../../uiBridge'
import type { SeaEvent, SeaColor, SeaCreature } from '../creatures'
import { creatureEmoji } from '../creatures'

type MarkState = { countCorrect?: boolean; colorCorrect?: boolean; nameCorrect?: boolean }

export function SeaAdventure() {
  const [event, setEvent] = useState<SeaEvent | null>(null)
  const [revealed, setRevealed] = useState<{ count?: boolean; color?: boolean; name?: boolean }>({})
  const [mark, setMark] = useState<MarkState>({})
  const [round, setRound] = useState(0)
  const [animateIn, setAnimateIn] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Bridge handlers for voice tools
  useEffect(() => {
    registerUiBus({
      seaSetEvent: (e: SeaEvent) => { setEvent(e); setRevealed({}); setMark({}); setRound(r => r + 1); setAnimateIn(false); requestAnimationFrame(() => setAnimateIn(true)) },
      seaReveal: (opts: { count?: boolean; color?: boolean; name?: boolean }) => setRevealed(prev => ({ ...prev, ...opts })),
      seaMark: (m: MarkState) => setMark(prev => ({ ...prev, ...m })),
      seaReset: () => { setEvent(null); setRevealed({}); setMark({}); setRound(0); setAnimateIn(false) },
      seaCelebrate: () => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1800) }
    })
  }, [])

  const onNextClick = () => {
    try { (window as any)?.oaiSession?.callTool?.('sea_next_event', {}) } catch {}
  }
  const onRevealClick = () => {
    try {
      if (!event) return
      if (event.type === 'countFish') (window as any)?.oaiSession?.callTool?.('sea_reveal', { count: true })
      if (event.type === 'colorFish') (window as any)?.oaiSession?.callTool?.('sea_reveal', { color: true })
      if (event.type === 'nameCreature') (window as any)?.oaiSession?.callTool?.('sea_reveal', { name: true })
    } catch {}
  }
  const onReset = () => { try { (window as any)?.oaiSession?.callTool?.('sea_reset', {}) } catch {} }

  // no-op placeholder (animation handled in EventView)

  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <div className="text-lg font-bold">Under the Sea Adventure</div>
          <div className="text-xs text-slate-500">Count fish, name colors, and sea creatures!</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-slate-200" onClick={onReset}>Reset</button>
          <button className="px-3 py-1 rounded bg-slate-200" onClick={onRevealClick} disabled={!event}>Reveal</button>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={onNextClick}>Next event</button>
        </div>
      </div>
      <div
        className="relative overflow-hidden min-h-[520px] sm:min-h-[560px]"
        ref={containerRef}
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/20" />
        <div className="absolute top-2 left-2 text-xs text-white/80">Round {round}</div>

        <div className={`w-full h-full grid place-items-center`}>
          {event ? (
            <EventView event={event} animateIn={animateIn} />
          ) : (
            <div className="text-white/90 text-center p-6">Press Next event or say "start the sea adventure".</div>
          )}
        </div>

        <AnswerPanel event={event} revealed={revealed} mark={mark} />

        {showConfetti && <Confetti />}
      </div>
    </div>
  )
}

function EventView({ event, animateIn }: { event: SeaEvent; animateIn: boolean }) {
  const fromLeft = event.direction === 'left'
  const base = 'transition-transform duration-700 ease-out'
  const start = fromLeft ? '-translate-x-[120%]' : 'translate-x-[120%]'
  const end = 'translate-x-0'
  return (
    <div className={`${base} ${animateIn ? end : start}`}>
      {event.type === 'countFish' && <SchoolOfFish count={event.fishCount} />}
      {event.type === 'colorFish' && <BigFish color={event.color} />}
      {event.type === 'nameCreature' && <Creature name={event.creature} />}
    </div>
  )
}

function SchoolOfFish({ count }: { count: number }) {
  const items = Array.from({ length: Math.max(2, Math.min(10, count)) })
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-lg">
      {items.map((_, i) => (
        <span key={i} className="text-4xl">🐟</span>
      ))}
    </div>
  )
}

function BigFish({ color }: { color: SeaColor }) {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140">
      <g>
        <ellipse cx="90" cy="70" rx="70" ry="40" fill={toColor(color)} />
        <polygon points="150,70 210,40 210,100" fill={toColor(color)} />
        <circle cx="70" cy="60" r="6" fill="#111827" />
      </g>
    </svg>
  )
}

function Creature({ name }: { name: SeaCreature }) {
  return (
    <div className="text-7xl text-white drop-shadow">{creatureEmoji(name)}</div>
  )
}

function AnswerPanel({ event, revealed, mark }: { event: SeaEvent | null; revealed: any; mark: any }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-2xl border p-3 shadow flex gap-3">
      {event?.type === 'countFish' && (
        <InfoCard label="Count" value={revealed.count ? String(event.fishCount) : '???'} correct={mark.countCorrect} />
      )}
      {event?.type === 'colorFish' && (
        <InfoCard label="Color" value={revealed.color ? capitalize(event.color) : '???'} correct={mark.colorCorrect} />
      )}
      {event?.type === 'nameCreature' && (
        <InfoCard label="Name" value={revealed.name ? capitalize(event.creature) : '???'} correct={mark.nameCorrect} />
      )}
    </div>
  )
}

function InfoCard({ label, value, correct }: { label: string; value: string; correct?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${correct === true ? 'border-emerald-400 bg-emerald-50' : correct === false ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'}`}>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  )
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none grid place-items-center">
      <div className="text-5xl animate-bounce">🎉</div>
    </div>
  )
}

function toColor(c: SeaColor): string {
  switch (c) {
    case 'red': return '#ef4444'
    case 'orange': return '#f97316'
    case 'yellow': return '#f59e0b'
    case 'green': return '#22c55e'
    case 'blue': return '#3b82f6'
    case 'purple': return '#a855f7'
    case 'pink': return '#ec4899'
  }
}

function capitalize(s: string) { return s.slice(0,1).toUpperCase() + s.slice(1) }
