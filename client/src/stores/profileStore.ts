import { create } from 'zustand'
import { openDB } from 'idb'

export type KidProfile = {
  id: string
  displayName: string
  ageBand: '2-4'|'5-7'|'8-10'|'11-13'|'14+'
  grade?: string
  avatarIndex: number
  favoriteSubjects: Array<'math'|'reading'|'science'|'creativity'|'music'|'social'>
  favoriteThemes: string[]
  preferredModalities: Array<'draw'|'game'|'quiz'|'story'|'voice'>
  language: string
  uiTheme: 'auto' | string
  sessionLength: number
  ttsSpeed: number
  captions: boolean
}

const defaultProfile: KidProfile = {
  id: 'kid-local',
  displayName: 'Guest',
  ageBand: '5-7',
  grade: '2',
  avatarIndex: 0,
  favoriteSubjects: ['math','creativity'],
  favoriteThemes: ['space','animals'],
  preferredModalities: ['draw','voice','game'],
  language: 'en',
  uiTheme: 'auto',
  sessionLength: 8,
  ttsSpeed: 1.0,
  captions: true,
}

type ProfileStore = {
  profile: KidProfile
  profiles: KidProfile[]
  switchProfile: (id: string) => void
  update: (patch: Partial<KidProfile>) => void
  loadFromDb: () => Promise<void>
  saveToDb: () => Promise<void>
  createProfile: (displayName?: string) => void
  toggleFavoriteSubject: (s: KidProfile['favoriteSubjects'][number]) => void
  togglePreferredModality: (m: KidProfile['preferredModalities'][number]) => void
  toggleFavoriteTheme: (t: string) => void
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: defaultProfile,
  profiles: [defaultProfile],
  switchProfile: (id) => set((s) => ({ profile: s.profiles.find(p => p.id === id) || s.profile })),
  update: (patch) => set((s) => {
    const next = { ...s.profile, ...patch }
    const others = s.profiles.filter(p => p.id !== next.id)
    const state = { profile: next, profiles: [next, ...others] }
    void get().saveToDb()
    return state
  }),
  loadFromDb: async () => {
    const db = await openDB('hummingbird', 1, { upgrade(db) { db.createObjectStore('profiles') } })
    const profiles = (await db.get('profiles', 'all')) as KidProfile[] | undefined
    if (profiles && profiles.length) {
      set({ profiles, profile: profiles[0] })
    }
  },
  saveToDb: async () => {
    const db = await openDB('hummingbird', 1, { upgrade(db) { db.createObjectStore('profiles') } })
    const { profiles } = get()
    await db.put('profiles', profiles, 'all')
  },
  createProfile: (displayName) => set((s) => {
    const p: KidProfile = {
      ...defaultProfile,
      id: 'kid-' + Date.now(),
      displayName: displayName || 'New Kid',
      avatarIndex: Math.floor(Math.random() * 12)
    }
    const profiles = [p, ...s.profiles]
    void get().saveToDb()
    return { profiles, profile: p }
  }),
  toggleFavoriteSubject: (subject) => set((s) => {
    const has = s.profile.favoriteSubjects.includes(subject)
    const fav = has ? s.profile.favoriteSubjects.filter(x => x !== subject) : [...s.profile.favoriteSubjects, subject]
    const next = { ...s.profile, favoriteSubjects: fav }
    const others = s.profiles.filter(p => p.id !== next.id)
    void get().saveToDb()
    return { profile: next, profiles: [next, ...others] }
  }),
  togglePreferredModality: (m) => set((s) => {
    const has = s.profile.preferredModalities.includes(m)
    const arr = has ? s.profile.preferredModalities.filter(x => x !== m) : [...s.profile.preferredModalities, m]
    const next = { ...s.profile, preferredModalities: arr }
    const others = s.profiles.filter(p => p.id !== next.id)
    void get().saveToDb()
    return { profile: next, profiles: [next, ...others] }
  }),
  toggleFavoriteTheme: (t) => set((s) => {
    const has = s.profile.favoriteThemes.includes(t)
    const arr = has ? s.profile.favoriteThemes.filter(x => x !== t) : [...s.profile.favoriteThemes, t]
    const next = { ...s.profile, favoriteThemes: arr }
    const others = s.profiles.filter(p => p.id !== next.id)
    void get().saveToDb()
    return { profile: next, profiles: [next, ...others] }
  })
}))


