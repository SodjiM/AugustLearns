import './App.css'
import { useAppStore } from './store'
import { Notepad } from './components/Notepad'
import { ModulePanel } from './components/ModulePanel'
import { ProfileAvatar } from './components/ProfileAvatarPicker'
import { SettingsDialogButton } from './components/SettingsDialog'
import { useState } from 'react'
import { startRealtime, waitForDataChannelOpen } from './realtime'
import { BASE_SYSTEM_PROMPT } from './prompts/baseSystemPrompt'
import { TOOL_SUPERSET } from './realtimeTools'

async function fetchSessionToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/session-token')
    if (!res.ok) return null
    const json = await res.json()
    // OpenAI ephemeral credential lives at client_secret.value
    return json?.client_secret?.value ?? null
  } catch {
    return null
  }
}

function App() {
  const { uiMode, openNotepad, closeNotepad, setTokenStatus, tokenStatus } = useAppStore()
  const [ephemeral, setEphemeral] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [sessionRef, setSessionRef] = useState<null | { stop: () => void, dc: RTCDataChannel }>(null)

  const onTalk = async () => {
    if (active && sessionRef) {
      sessionRef.stop()
      setActive(false)
      return
    }
    setTokenStatus('loading')
    const token = await fetchSessionToken()
    if (!token) { setTokenStatus('error', 'Failed to get token'); return }
    setEphemeral(token)
    setTokenStatus('ok')

    try {
      const session = await startRealtime({ ephemeralKey: token, onStatus: (s) => console.log('[rtc]', s) })
      await waitForDataChannelOpen(session.dc)
      // Send base system prompt and tool superset after DC is open
      session.dc.send(JSON.stringify({
        type: 'session.update',
        session: {
          instructions: BASE_SYSTEM_PROMPT,
          tools: TOOL_SUPERSET,
          tool_choice: 'auto',
          modalities: ['audio','text'],
          turn_detection: { type: 'server_vad', threshold: 0.5, prefix_padding_ms: 250, silence_duration_ms: 400 }
        }
      }))
      // Optional gentle greeting without prescriptive onboarding
      session.dc.send(JSON.stringify({ type: 'response.create', response: { instructions: 'In English, say hello warmly and ask what they would like to explore. be excited and reference name and interests.' } }))
      ;(window as any).oaiSession = session
      setSessionRef(session as any)
      setActive(true)
    } catch (e) {
      console.error(e)
      setTokenStatus('error', 'RTC failed')
    }
  }

  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <header className="px-4 py-3 border-b bg-white/90 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xl font-black tracking-tight">🐦 Hummingbird Tutor</div>
          <span className="text-xs text-slate-500 hidden sm:inline">Learn by talking and drawing</span>
        </div>
        <div className="flex items-center gap-3">
          <ProfileAvatar />
          <button className={`px-4 py-2 rounded-full font-semibold shadow ${active ? 'bg-rose-600 animate-pulse' : 'bg-indigo-600'} text-white`} onClick={onTalk}>
            {tokenStatus === 'loading' ? 'Connecting…' : active ? 'Stop Listening' : 'Talk'}
          </button>
          <button className="px-3 py-1 rounded bg-slate-200" onClick={() => (useAppStore.getState().uiMode === 'notepad' ? closeNotepad() : openNotepad())}>Toggle Notepad</button>
          <SettingsDialogButton />
        </div>
      </header>

      <main className="grid grid-cols-4">
        <aside className="border-r bg-white p-3 space-y-4 w-80">
          <div className="text-sm text-slate-500"><span className="font-semibold">Modules</span><div className="text-xs text-slate-400">Pick a module to explore. Say things like “show fun math,” “practice halves,” or “quick lessons.”</div></div>
          <ModulePanel />
          <SettingsStrip />
        </aside>
        <section className="col-span-3">
          <ActiveModuleBanner />
          {uiMode === 'notepad' ? (
            <Notepad />
          ) : (
            <div className="h-full grid place-items-center text-slate-500">
              {tokenStatus === 'ok' && ephemeral ? 'Ready to start voice once WebRTC is wired.' : 'Press Talk to begin'}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

// old tile kept for reference; not used

function ActiveModuleBanner() {
  const { activeModuleId } = useAppStore()
  if (!activeModuleId) return null
  return (
    <div className="px-4 py-2 bg-indigo-600 text-white text-sm">Module active: {activeModuleId}</div>
  )
}

// ModuleCard moved into ModulePanel usage; keeping definition removed to avoid unused symbol

function SettingsStrip() {
  const { volume, setVolume, micMuted, muteMic, unmuteMic } = useAppStore()
  return (
    <div className="mt-4 p-3 rounded-xl bg-slate-50 border space-y-3">
      <div className="text-sm font-medium">Settings</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">Volume</span>
        <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">Mic</span>
        <button className={`px-2 py-1 rounded text-xs ${micMuted ? 'bg-slate-300' : 'bg-emerald-500 text-white'}`} onClick={() => micMuted ? unmuteMic() : muteMic()}>{micMuted ? 'Muted' : 'On'}</button>
      </div>
    </div>
  )
}

export default App
