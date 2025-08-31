// Simple pub/sub bridge so voice tools can open/close dialogs or click buttons
type UiBus = {
  openProfile: () => void
  closeProfile: () => void
  abcsMarkLetter: (letter: string) => void
  abcsReset: () => void
  triggerCelebrate: () => void
  barnSetAnimal: (animal: any) => void
  barnReveal: (opts: { name?: boolean; sound?: boolean }) => void
  barnMark: (m: { nameCorrect?: boolean; soundCorrect?: boolean }) => void
  barnReset: () => void
  barnCelebrate: () => void
  seaSetEvent: (e: any) => void
  seaReveal: (opts: { count?: boolean; color?: boolean; name?: boolean }) => void
  seaMark: (m: { countCorrect?: boolean; colorCorrect?: boolean; nameCorrect?: boolean }) => void
  seaReset: () => void
  seaCelebrate: () => void
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
export function barnSetAnimal(animal: any) { (listeners as any).barnSetAnimal?.(animal) }
export function barnReveal(opts: { name?: boolean; sound?: boolean }) { (listeners as any).barnReveal?.(opts) }
export function barnMark(m: { nameCorrect?: boolean; soundCorrect?: boolean }) { (listeners as any).barnMark?.(m) }
export function barnReset() { (listeners as any).barnReset?.() }
export function barnCelebrate() { (listeners as any).barnCelebrate?.() }
export function seaSetEvent(e: any) { (listeners as any).seaSetEvent?.(e) }
export function seaReveal(opts: { count?: boolean; color?: boolean; name?: boolean }) { (listeners as any).seaReveal?.(opts) }
export function seaMark(m: { countCorrect?: boolean; colorCorrect?: boolean; nameCorrect?: boolean }) { (listeners as any).seaMark?.(m) }
export function seaReset() { (listeners as any).seaReset?.() }
export function seaCelebrate() { (listeners as any).seaCelebrate?.() }


