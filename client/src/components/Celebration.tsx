import { useEffect, useMemo, useState } from 'react'

type Props = { onDone?: () => void }

export function Celebration({ onDone }: Props) {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 16), 16)
    const stop = setTimeout(() => { clearInterval(id); onDone?.() }, 3500)
    return () => { clearInterval(id); clearTimeout(stop) }
  }, [])

  const confetti = useMemo(() => Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    x: Math.random(),
    y: -Math.random(),
    s: 6 + Math.random() * 8,
    color: ['#ef4444','#f97316','#f59e0b','#22c55e','#3b82f6','#6366f1','#a855f7'][i % 7],
    drift: (Math.random() - 0.5) * 0.002
  })), [])

  const balloons = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random(),
    y: 1 + Math.random() * 0.3,
    s: 30 + Math.random() * 20,
    color: ['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7'][i % 5]
  })), [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <svg className="absolute inset-0 w-full h-full">
        {confetti.map((c) => {
          const y = (c.y + t * 0.0002) * 100
          const x = (c.x + Math.sin(t * 0.002 + c.id) * 0.002 + c.drift * t) * 100
          return <rect key={c.id} x={`${x}%`} y={`${y}%`} width={c.s} height={c.s} fill={c.color} transform={`rotate(${(t*0.1 + c.id) % 360} ${x} ${y})`} />
        })}
        {balloons.map((b) => {
          const y = (b.y - t * 0.0002) * 100
          const x = b.x * 100
          return <g key={b.id}>
            <line x1={`${x}%`} y1={`${y+4}%`} x2={`${x}%`} y2={`${y+10}%`} stroke="#64748b" strokeWidth={2} />
            <ellipse cx={`${x}%`} cy={`${y}%`} rx={b.s*0.6} ry={b.s} fill={b.color} />
          </g>
        })}
      </svg>
      {/* TODO: Play small celebration sound here */}
    </div>
  )
}


