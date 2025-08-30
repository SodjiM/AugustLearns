import { useEffect, useRef } from 'react'
import { useAppStore } from '../store'
import { CanvasBoard } from './CanvasBoard'

export function Notepad() {
  const { pages, currentPageId, newPage, appendNote } = useAppStore()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!currentPageId) newPage()
  }, [currentPageId, newPage])

  const page = pages.find(p => p.id === currentPageId) || null

  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="p-3 border-b bg-white flex items-center gap-3">
        <div className="font-semibold">Notepad</div>
        <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={newPage}>New Page</button>
      </div>
      <div className="grid grid-cols-2 h-full">
        <div className="p-4 space-y-2 overflow-auto">
          <h2 className="font-semibold">Notes</h2>
          <div className="space-y-1">
            {page?.notes.map((n, i) => (
              <div key={i} className="p-2 rounded bg-slate-100">• {n}</div>
            ))}
          </div>
        </div>
        <div className="p-4 border-l bg-slate-50 space-y-3">
          <div className="rounded-lg p-2 bg-white shadow-inner" style={{backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            <CanvasBoard />
          </div>
          <textarea ref={textareaRef} className="w-full h-32 p-2 border rounded" placeholder="Type a note…" />
          <div className="mt-2">
            <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => {
              const v = textareaRef.current?.value?.trim()
              if (v) { appendNote(v); if (textareaRef.current) textareaRef.current.value = '' }
            }}>Add Note</button>
          </div>
        </div>
      </div>
    </div>
  )
}


