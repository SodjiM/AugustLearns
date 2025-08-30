import { useProfileStore } from '../stores/profileStore'
import sprite from '../../../assets/childProfilePictures.jpg'

const COLS = 4
const ROWS = 3
const TOTAL = COLS * ROWS // 12

export function ProfileAvatarPicker() {
  const { profile, update } = useProfileStore()
  return (
    <div>
      <div className="text-sm font-medium mb-2">Choose your picture</div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => update({ avatarIndex: i })}
            className={`aspect-square rounded-lg overflow-hidden border ${profile.avatarIndex === i ? 'ring-2 ring-indigo-500' : 'hover:opacity-90'}`}
            aria-label={`Avatar ${i+1}`}
          >
            <Sprite index={i} />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ProfileAvatar({ size = 40 }: { size?: number }) {
  const { profile } = useProfileStore()
  return (
    <div className="rounded-full overflow-hidden border" style={{ width: size, height: size }}>
      <Sprite index={profile.avatarIndex} />
    </div>
  )
}

function Sprite({ index }: { index: number }) {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const bgSize = `${COLS * 100}% ${ROWS * 100}%`
  const bgPos = `${(col/(COLS-1))*100}% ${(row/(ROWS-1))*100}%`
  return (
    <div
      style={{ backgroundImage: `url(${sprite})`, backgroundSize: bgSize, backgroundPosition: bgPos }}
      className="w-full h-full bg-no-repeat"
    />
  )
}


