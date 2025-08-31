import type { ModuleMeta } from './types'

// Import metadata for each module here (can be lazy-loaded in future)
import { meta as literacyAbcsMeta } from './literacy/abcs/meta'
import { meta as mathFractionsIntroMeta } from './math/fractions-intro/meta'
import { meta as scienceBarnAnimalsMeta } from './science/barn-animals/meta'
import { meta as scienceSeaAdventureMeta } from './science/sea-adventure/meta'

export const MODULES: ModuleMeta[] = [
  literacyAbcsMeta,
  mathFractionsIntroMeta,
  scienceBarnAnimalsMeta,
  scienceSeaAdventureMeta,
]


