// Simple pub/sub bridge so voice tools can open/close dialogs or click buttons
type UiBus = {
  openProfile: () => void
  closeProfile: () => void
  abcsMarkLetter: (letter: string) => void
  abcsReset: () => void
  triggerCelebrate: () => void
}

const listeners: Partial<UiBus> = {}

export function registerUiBus(partial: Partial<UiBus>) {
  Object.assign(listeners, partial)
}

export function openProfile() { listeners.openProfile?.() }
export function closeProfile() { listeners.closeProfile?.() }
export function abcsMarkLetter(letter: string) { listeners.abcsMarkLetter?.(letter) }
export function abcsReset() { listeners.abcsReset?.() }
export function triggerCelebrate() { listeners.triggerCelebrate?.() }


