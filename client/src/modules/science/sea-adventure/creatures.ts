export const SEA_COLORS = ['red','orange','yellow','green','blue','purple','pink'] as const
export type SeaColor = typeof SEA_COLORS[number]

export type SeaCreature = 'whale' | 'jellyfish' | 'octopus' | 'shark' | 'turtle' | 'crab' | 'dolphin' | 'blowfish' | 'tropical fish' | 'clownfish'

export function creatureEmoji(name: SeaCreature): string {
  switch (name) {
    case 'whale': return '🐋'
    case 'jellyfish': return '🪼'
    case 'octopus': return '🐙'
    case 'shark': return '🦈'
    case 'turtle': return '🐢'
    case 'crab': return '🦀'
    case 'dolphin': return '🐬'
    case 'blowfish': return '🐡'
    case 'tropical fish': return '🐠'
    case 'clownfish': return '🐠'
    default: return '🐟'
  }
}

export type SeaEvent =
  | { type: 'countFish'; direction: 'left' | 'right'; fishCount: number }
  | { type: 'colorFish'; direction: 'left' | 'right'; color: SeaColor }
  | { type: 'nameCreature'; direction: 'left' | 'right'; creature: SeaCreature }

export function randomSeaEvent(): SeaEvent {
  const dir: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right'
  const roll = Math.random()
  if (roll < 1/3) {
    const fishCount = 2 + Math.floor(Math.random()*9) // 2..10
    return { type: 'countFish', direction: dir, fishCount }
  } else if (roll < 2/3) {
    const color = SEA_COLORS[Math.floor(Math.random()*SEA_COLORS.length)]
    return { type: 'colorFish', direction: dir, color }
  } else {
    const creatures: SeaCreature[] = ['whale','jellyfish','octopus','shark','turtle','crab','dolphin','blowfish','tropical fish','clownfish']
    const creature = creatures[Math.floor(Math.random()*creatures.length)]
    return { type: 'nameCreature', direction: dir, creature }
  }
}

