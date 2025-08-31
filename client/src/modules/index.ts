import type { ModuleMeta } from './types'

// Import metadata for each module here (can be lazy-loaded in future)
import { meta as literacyAbcsMeta } from './literacy/abcs/meta'
import { meta as mathFractionsIntroMeta } from './math/fractions-intro/meta'

export const MODULES: ModuleMeta[] = [
  literacyAbcsMeta,
  mathFractionsIntroMeta,
]


