import { create } from 'zustand'

export type UiMode = 'home' | 'notepad'

export type Shape = {
  id: string
  kind: 'circle' | 'rect' | 'label'
  x: number
  y: number
  size?: number
  width?: number
  height?: number
  color: string
  text?: string
  fontSize?: number
}

type NotepadPage = {
  id: string
  createdAt: number
  notes: string[]
  shapes: Shape[]
}

type AppState = {
  uiMode: UiMode
  notepadOpen: boolean
  modulePanelMinimized: boolean
  pages: NotepadPage[]
  currentPageId: string | null
  tokenStatus: 'idle' | 'loading' | 'ok' | 'error'
  tokenError?: string
  activeModuleId: string | null
  micMuted: boolean
  volume: number
  setUiMode: (m: UiMode) => void
  openNotepad: () => void
  closeNotepad: () => void
  minimizeModulePanel: () => void
  restoreModulePanel: () => void
  toggleModulePanel: () => void
  newPage: () => void
  appendNote: (text: string) => void
  drawShape: (shape: Omit<Shape, 'id'>) => void
  clearCanvas: () => void
  setTokenStatus: (s: AppState['tokenStatus'], err?: string) => void
  setActiveModule: (id: string | null) => void
  setVolume: (level: number) => void
  muteMic: () => void
  unmuteMic: () => void
}

const makeId = () => Math.random().toString(36).slice(2)

export const useAppStore = create<AppState>((set, get) => ({
  uiMode: 'home',
  notepadOpen: false,
  modulePanelMinimized: false,
  pages: [],
  currentPageId: null,
  tokenStatus: 'idle',
  activeModuleId: null,
  micMuted: false,
  volume: 1,
  setUiMode: (m) => set({ uiMode: m }),
  openNotepad: () => set({ notepadOpen: true, uiMode: 'notepad' }),
  closeNotepad: () => set({ notepadOpen: false, uiMode: 'home' }),
  minimizeModulePanel: () => set({ modulePanelMinimized: true }),
  restoreModulePanel: () => set({ modulePanelMinimized: false }),
  toggleModulePanel: () => set((s) => ({ modulePanelMinimized: !s.modulePanelMinimized })),
  newPage: () => {
    const page: NotepadPage = { id: makeId(), createdAt: Date.now(), notes: [], shapes: [] }
    set((s) => ({ pages: [page, ...s.pages], currentPageId: page.id }))
  },
  appendNote: (text) => {
    const { currentPageId } = get()
    if (!currentPageId) return
    set((s) => ({
      pages: s.pages.map((p) => p.id === currentPageId ? { ...p, notes: [...p.notes, text] } : p)
    }))
  },
  drawShape: (shape) => {
    const { currentPageId } = get()
    if (!currentPageId) return
    const sId = makeId()
    set((s) => ({
      pages: s.pages.map((p) => p.id === currentPageId ? { ...p, shapes: [...p.shapes, { id: sId, ...shape }] } : p)
    }))
  },
  clearCanvas: () => {
    const { currentPageId } = get()
    if (!currentPageId) return
    set((s) => ({
      pages: s.pages.map((p) => p.id === currentPageId ? { ...p, shapes: [] } : p)
    }))
  },
  setTokenStatus: (status, tokenError) => set({ tokenStatus: status, tokenError }),
  setActiveModule: (id) => set({ activeModuleId: id }),
  setVolume: (level) => set({ volume: Math.max(0, Math.min(1, level)) }),
  muteMic: () => set({ micMuted: true }),
  unmuteMic: () => set({ micMuted: false })
}))


