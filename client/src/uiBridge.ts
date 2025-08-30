// Simple pub/sub bridge so voice tools can open/close dialogs or click buttons
type UiBus = {
  openProfile: () => void
  closeProfile: () => void
}

const listeners: Partial<UiBus> = {}

export function registerUiBus(partial: Partial<UiBus>) {
  Object.assign(listeners, partial)
}

export function openProfile() { listeners.openProfile?.() }
export function closeProfile() { listeners.closeProfile?.() }


