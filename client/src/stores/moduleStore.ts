import { create } from 'zustand'
import type { ModuleMeta, FilterParams, Section } from '../modules/types'
import { SEED_MODULES } from '../modules/seed'
import { useProfileStore } from './profileStore'

type ModuleStore = {
  all: ModuleMeta[]
  view: { chips: string[]; sections: Section[] }
  filterModules: (params: FilterParams) => { chips: string[]; sections: Section[] }
}

function matches(m: ModuleMeta, p: FilterParams, _profileAge?: string, profileGrade?: string) {
  if (p.subject && m.subject !== p.subject) return false
  if (p.ageBand && m.ageBand !== p.ageBand) return false
  if (profileGrade && p.gradeBand === undefined && m.gradeBand && !m.gradeBand.includes(profileGrade)) {
    // allow, but prefer later in ranking
  }
  if (p.topics && p.topics.length && !p.topics.some(t => m.topics?.includes(t))) return false
  if (p.skills && p.skills.length && !p.skills.some(s => m.skills?.includes(s))) return false
  if (p.modality && p.modality.length && !p.modality.some(x => m.modality?.includes(x))) return false
  if (p.activityType && p.activityType.length && !p.activityType.some(x => m.activityType?.includes(x))) return false
  if (p.themeTags && p.themeTags.length && !p.themeTags.some(x => m.themeTags?.includes(x))) return false
  if (typeof p.maxDuration === 'number' && m.duration > p.maxDuration) return false
  if (m.enabled === false) return false
  return true
}

function rank(mods: ModuleMeta[], _p: FilterParams): ModuleMeta[] {
  const profile = useProfileStore.getState().profile
  const ageMatch = (m: ModuleMeta) => (m.ageBand === profile.ageBand ? 1 : 0)
  const subjectAff = (m: ModuleMeta) => (profile.favoriteSubjects.includes(m.subject as any) ? 1 : 0)
  const modalityMatch = (m: ModuleMeta) => (m.modality.some(x => (profile.preferredModalities as any).includes(x)) ? 1 : 0)
  const themeAff = (m: ModuleMeta) => (m.themeTags?.some(t => profile.favoriteThemes.includes(t)) ? 1 : 0)
  const fun = (m: ModuleMeta) => (m.funFactor ?? 0) / 5
  const freshness = (m: ModuleMeta) => (m.lastPlayedAt ? 1 - Math.min(1, (Date.now() - Date.parse(m.lastPlayedAt)) / (1000*60*60*24*14)) : 0.8)
  const struggle = (m: ModuleMeta) => m.struggleScore ?? 0
  const masteryInv = (m: ModuleMeta) => 1 - (m.masteryScore ?? 0)
  return [...mods].sort((a,b) => {
    const score = (m: ModuleMeta) =>
      0.25 * ageMatch(m) +
      0.15 * subjectAff(m) +
      0.12 * modalityMatch(m) +
      0.10 * themeAff(m) +
      0.15 * masteryInv(m) +
      0.10 * struggle(m) +
      0.10 * fun(m) +
      0.10 * freshness(m)
    return score(b) - score(a)
  })
}

export const useModuleStore = create<ModuleStore>((set) => ({
  all: SEED_MODULES,
  view: { chips: [], sections: [] },
  filterModules: (params) => {
    const profile = useProfileStore.getState().profile
    const filtered = SEED_MODULES.filter(m => matches(m, params, profile.ageBand, profile.grade))
    const ranked = rank(filtered, params)
    const title = 'For You'
    const chips: string[] = []
    if (params.subject) chips.push(params.subject)
    if (params.themeTags?.length) chips.push(...params.themeTags)
    if (params.maxDuration) chips.push(`≤${params.maxDuration}m`)
    const sections: Section[] = [{ id: 'for-you', title, modules: ranked.slice(0, 8) }]
    set({ view: { chips, sections } })
    return { chips, sections }
  }
}))


