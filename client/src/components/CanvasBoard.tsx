import { useMemo } from 'react'
import { useAppStore } from '../store'

export function CanvasBoard() {
  const { pages, currentPageId } = useAppStore()
  const shapes = useMemo(() => pages.find(p => p.id === currentPageId)?.shapes ?? [], [pages, currentPageId])

  return (
    <div className="w-full h-80 bg-white border rounded grid place-items-center">
      <svg className="w-[95%] h-[90%]" viewBox="0 0 1000 600" data-testid="notepad-canvas">
        {shapes.map(s => {
          const x = s.x * 1000
          const y = s.y * 600
          if (s.kind === 'circle') {
            const r = (s.size ?? 40)
            return <circle key={s.id} cx={x} cy={y} r={r} fill={s.color} />
          }
          if (s.kind === 'rect') {
            const w = s.width ?? 100
            const h = s.height ?? 80
            return <rect key={s.id} x={x - w/2} y={y - h/2} width={w} height={h} fill={s.color} />
          }
          return null
        })}
      </svg>
    </div>
  )
}


