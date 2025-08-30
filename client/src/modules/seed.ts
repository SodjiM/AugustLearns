import type { ModuleMeta } from './types'

export const SEED_MODULES: ModuleMeta[] = [
  {
    id: 'math.counting.toddler',
    title: 'Counting Together',
    subject: 'math',
    topics: ['counting','numbers','colors'],
    ageBand: '2-4',
    gradeBand: 'K',
    skills: ['counting_1_5'],
    modality: ['voice','draw','game'],
    activityType: ['lesson','game'],
    duration: 5,
    assets: ['canvas'],
    themeTags: ['stars','animals'],
    difficulty: 1,
    funFactor: 4,
    enabled: true
  },
  {
    id: 'math.fractions.intro',
    title: 'Fractions Intro',
    subject: 'math',
    topics: ['fractions','halves','quarters'],
    ageBand: '5-7',
    gradeBand: '1-2',
    skills: ['fraction_halves','fraction_quarters'],
    modality: ['voice','draw','quiz'],
    activityType: ['lesson','quiz'],
    duration: 8,
    assets: ['fraction_pie','canvas'],
    themeTags: ['pizza','space'],
    difficulty: 2,
    funFactor: 4,
    enabled: true
  }
]


