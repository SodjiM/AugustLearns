let runtimeMedia: MediaStream | null = null
let runtimeAudio: HTMLAudioElement | null = null

type StartOptions = {
  ephemeralKey: string
  onStatus?: (s: string) => void
}

export async function startRealtime({ ephemeralKey, onStatus }: StartOptions) {
  const status = (s: string) => onStatus?.(s)
  status('init')

  const pc = new RTCPeerConnection()

  const remoteAudio = new Audio()
  remoteAudio.autoplay = true
  pc.ontrack = (event) => {
    const [stream] = event.streams
    if (stream) remoteAudio.srcObject = stream
  }

  const dc = pc.createDataChannel('oai-events')
  activeDc = dc
  dc.onopen = () => status('data-open')
  dc.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      if (msg?.type) console.log('[oai:event]', msg.type, msg)
      if (msg.type === 'response.function_call_arguments.delta' || msg.type === 'function_call.arguments.delta') {
        bufferArgs({ call_id: msg.call_id || msg.id || msg.response?.id, chunk: msg.arguments ?? msg.delta ?? msg.arguments_delta })
      } else if (msg.type === 'response.function_call' || msg.type === 'function_call') {
        if (msg.call_id || msg.id) recordFunctionName(String(msg.call_id || msg.id), String(msg.name || msg.function_call?.name))
      } else if (msg.type === 'response.output_item.added' && msg.item?.type === 'function_call') {
        const id = msg.item.call_id || msg.item.id
        if (id && msg.item.name) recordFunctionName(String(id), String(msg.item.name))
        if (id && msg.item.arguments) {
          try {
            const parsed = JSON.parse(msg.item.arguments)
            const name = msg.item.name as string
            void handleTool(String(id), name, parsed)
          } catch {}
        }
      } else if (msg.type === 'response.function_call_arguments.done') {
        const id = String(msg.call_id || msg.id)
        flushArgs(id)
      } else if (msg.type === 'response.delta' && msg.delta?.type && String(msg.delta.type).includes('function_call')) {
        const callId = msg.delta.call_id || msg.call_id || msg.id
        if (msg.delta.name) recordFunctionName(String(callId), String(msg.delta.name))
        if (msg.delta.arguments || msg.delta.delta) bufferArgs({ call_id: String(callId), chunk: msg.delta.arguments || msg.delta.delta })
      }
    } catch {}
  }

  const media = await navigator.mediaDevices.getUserMedia({ audio: true })
  for (const track of media.getTracks()) pc.addTrack(track, media)
  runtimeMedia = media
  runtimeAudio = remoteAudio

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-realtime', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ephemeralKey}`,
      'Content-Type': 'application/sdp'
    },
    body: offer.sdp || ''
  })

  if (!sdpResponse.ok) {
    status('error')
    const t = await sdpResponse.text()
    throw new Error(`SDP failed: ${t}`)
  }

  const answer = { type: 'answer', sdp: await sdpResponse.text() } as RTCSessionDescriptionInit
  await pc.setRemoteDescription(answer)
  status('connected')

  // Apply initial settings from store
  try {
    const { useAppStore } = await import('./store')
    const muted = useAppStore.getState().micMuted
    media.getAudioTracks().forEach(tr => tr.enabled = !muted)
    const v = useAppStore.getState().volume
    remoteAudio.volume = Math.max(0, Math.min(1, v))
  } catch {}

  return {
    pc,
    dc,
    callTool,
    stop: () => {
      dc.close()
      pc.close()
      media.getTracks().forEach(t => t.stop())
      status('stopped')
      runtimeMedia = null
      runtimeAudio = null
    }
  }
}

// Accumulate streamed tool arguments and function names per call
let callMeta: Record<string, { name?: string, args: string }> = {}

// Simple counters for Sea Adventure session pacing
let seaEventsDone = 0
let seaMaxEvents = 0

function recordFunctionName(callId: string, name: string) {
  if (!callMeta[callId]) callMeta[callId] = { args: '' }
  callMeta[callId].name = name
}

function bufferArgs({ call_id, chunk }: { call_id: string, chunk: string }) {
  if (!callMeta[call_id]) callMeta[call_id] = { args: '' }
  callMeta[call_id].args += chunk || ''
  const combined = callMeta[call_id].args
  try {
    const parsedArgs = JSON.parse(combined)
    const name = callMeta[call_id].name
    if (name) {
      void handleTool(call_id, name, parsedArgs)
      delete callMeta[call_id]
    }
  } catch {
    // keep buffering until valid JSON
  }
}

function flushArgs(call_id: string) {
  if (!callMeta[call_id]) return
  try {
    const parsedArgs = JSON.parse(callMeta[call_id].args)
    const name = callMeta[call_id].name
    if (name) void handleTool(call_id, name, parsedArgs)
  } catch {}
  delete callMeta[call_id]
}

async function handleTool(callId: string, name: string, args: any) {
  let output: any = { ok: true }
  try {
    switch (name) {
      case 'open_notepad': {
        const { useAppStore } = await import('./store')
        useAppStore.getState().openNotepad()
        break
      }
      case 'append_note': {
        const { useAppStore } = await import('./store')
        if (!useAppStore.getState().currentPageId) useAppStore.getState().newPage()
        useAppStore.getState().appendNote(String(args?.text ?? ''))
        break
      }
      case 'draw_shape': {
        const { useAppStore } = await import('./store')
        if (!useAppStore.getState().currentPageId) useAppStore.getState().newPage()
        useAppStore.getState().drawShape({
          kind: args?.kind === 'rect' ? 'rect' : args?.kind === 'label' ? 'label' : 'circle',
          x: Number(args?.x ?? 0.5),
          y: Number(args?.y ?? 0.5),
          size: args?.radius ?? args?.size,
          width: args?.width,
          height: args?.height,
          color: String(args?.color ?? '#ef4444'),
          text: args?.text,
          fontSize: args?.fontSize
        })
        break
      }
      case 'close_notepad': {
        const { useAppStore } = await import('./store')
        useAppStore.getState().closeNotepad()
        break
      }
      case 'clear_canvas': {
        const { useAppStore } = await import('./store')
        useAppStore.getState().clearCanvas()
        break
      }
      case 'new_page': {
        const { useAppStore } = await import('./store')
        useAppStore.getState().newPage()
        break
      }
      case 'goto_module': {
        const { useAppStore } = await import('./store')
        const raw = String(args?.id ?? '').trim()
        let resolved: string | null = null
        try {
          const { MODULES } = await import('./modules')
          const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
          const rawNorm = norm(raw)
          // 1) exact id
          const exact = MODULES.find(m => m.id === raw)
          if (exact) resolved = exact.id
          else {
            // 2) title or topic fuzzy match
            const byTitle = MODULES.find(m => norm(m.title) === rawNorm || norm(m.title).includes(rawNorm) || rawNorm.includes(norm(m.title)))
            if (byTitle) resolved = byTitle.id
            else {
              // 3) quick alias for barn animals
              if (/(barn|farm)\s+animals?/.test(rawNorm)) {
                const barn = MODULES.find(m => m.id === 'science.barn-animals.identify')
                if (barn) resolved = barn.id
              }
            }
          }
        } catch {}
        useAppStore.getState().setActiveModule(resolved ?? raw)
        break
      }
      case 'filter_modules': {
        const { useModuleStore } = await import('./stores/moduleStore')
        const result = useModuleStore.getState().filterModules(args || {})
        output = { ok: true, ...result }
        break
      }
      case 'update_profile': {
        const { useProfileStore } = await import('./stores/profileStore')
        useProfileStore.getState().update(args?.patch || {})
        output = { ok: true }
        break
      }
      case 'set_volume': {
        const { useAppStore } = await import('./store')
        const level = Math.max(0, Math.min(1, Number(args?.level ?? 1)))
        useAppStore.getState().setVolume(level)
        if (runtimeAudio) runtimeAudio.volume = level
        break
      }
      case 'set_mic': {
        const { useAppStore } = await import('./store')
        const off = String(args?.state) === 'off'
        if (off) useAppStore.getState().muteMic(); else useAppStore.getState().unmuteMic()
        if (runtimeMedia) runtimeMedia.getAudioTracks().forEach(tr => tr.enabled = !off)
        break
      }
      case 'abcs_mark_letter': {
        const { abcsMarkLetter } = await import('./uiBridge')
        abcsMarkLetter(String(args?.letter || ''))
        break
      }
      case 'abcs_mark_letters': {
        const { abcsMarkLetter } = await import('./uiBridge')
        const seq: string = String(args?.sequence || '')
        for (const ch of seq) {
          if (/^[a-z]$/i.test(ch)) abcsMarkLetter(ch)
        }
        break
      }
      case 'abcs_reset': {
        const { abcsReset } = await import('./uiBridge')
        abcsReset()
        break
      }
      case 'abcs_celebrate': {
        const { triggerCelebrate } = await import('./uiBridge')
        triggerCelebrate()
        break
      }
      case 'open_profile': {
        const { openProfile } = await import('./uiBridge')
        openProfile()
        break
      }
      case 'close_profile': {
        const { closeProfile } = await import('./uiBridge')
        closeProfile()
        break
      }
      case 'minimize_module_panel': {
        const { useAppStore } = await import('./store')
        useAppStore.getState().minimizeModulePanel()
        break
      }
      case 'restore_module_panel': {
        const { useAppStore } = await import('./store')
        useAppStore.getState().restoreModulePanel()
        break
      }
      case 'toggle_module_panel': {
        const { useAppStore } = await import('./store')
        useAppStore.getState().toggleModulePanel()
        break
      }
      case 'barn_next': {
        const { BARN_ANIMALS } = await import('./modules/science/barn-animals/animals')
        const { barnSetAnimal } = await import('./uiBridge')
        const idx = Math.floor(Math.random() * BARN_ANIMALS.length)
        const chosen = BARN_ANIMALS[idx]
        barnSetAnimal(chosen)
        output = { ok: true, animal: chosen }
        break
      }
      case 'barn_reveal': {
        const { barnReveal } = await import('./uiBridge')
        barnReveal({ name: Boolean(args?.name), sound: Boolean(args?.sound) })
        break
      }
      case 'barn_mark': {
        const { barnMark } = await import('./uiBridge')
        barnMark({ nameCorrect: args?.nameCorrect, soundCorrect: args?.soundCorrect })
        break
      }
      case 'barn_reset': {
        const { barnReset } = await import('./uiBridge')
        barnReset()
        break
      }
      case 'barn_celebrate': {
        const { barnCelebrate } = await import('./uiBridge')
        barnCelebrate()
        break
      }
      case 'sea_next_event': {
        const { randomSeaEvent } = await import('./modules/science/sea-adventure/creatures')
        const { seaSetEvent } = await import('./uiBridge')
        if (seaMaxEvents <= 0) seaMaxEvents = 5 + Math.floor(Math.random()*3) // 5..7
        if (seaEventsDone >= seaMaxEvents) {
          output = { ok: true, done: true }
          break
        }
        const ev = randomSeaEvent()
        seaSetEvent(ev)
        seaEventsDone += 1
        output = { ok: true, event: ev, remaining: Math.max(0, seaMaxEvents - seaEventsDone) }
        break
      }
      case 'sea_reveal': {
        const { seaReveal } = await import('./uiBridge')
        seaReveal({ count: Boolean(args?.count), color: Boolean(args?.color), name: Boolean(args?.name) })
        break
      }
      case 'sea_mark': {
        const { seaMark } = await import('./uiBridge')
        seaMark({ countCorrect: args?.countCorrect, colorCorrect: args?.colorCorrect, nameCorrect: args?.nameCorrect })
        break
      }
      case 'sea_reset': {
        const { seaReset } = await import('./uiBridge')
        seaEventsDone = 0; seaMaxEvents = 0
        seaReset()
        break
      }
      case 'sea_celebrate': {
        const { seaCelebrate } = await import('./uiBridge')
        seaCelebrate()
        break
      }
      default:
        output = { ok: false, error: 'unknown_tool' }
    }
  } finally {
    callToolOutput(callId, output)
  }
}

let activeDc: RTCDataChannel | null = null
function callToolOutput(callId: string, output: any) {
  if (!activeDc) return
  activeDc.send(JSON.stringify({ type: 'response.function_call_output', call_id: callId, output }))
}

function callTool(name: string, args: any) {
  if (!activeDc) return
  activeDc.send(JSON.stringify({ type: 'response.create', response: { instructions: '', tool: { name, arguments: args } } }))
}

export function waitForDataChannelOpen(dc: RTCDataChannel, timeoutMs = 8000): Promise<void> {
  if (dc.readyState === 'open') return Promise.resolve()
  return new Promise((resolve, reject) => {
    const onOpen = () => { cleanup(); resolve() }
    const onClose = () => { cleanup(); reject(new Error('DataChannel closed before open')) }
    const onError = () => { cleanup(); reject(new Error('DataChannel error')) }
    const to = setTimeout(() => { cleanup(); reject(new Error('DataChannel open timeout')) }, timeoutMs)
    function cleanup() {
      clearTimeout(to)
      dc.removeEventListener('open', onOpen)
      dc.removeEventListener('close', onClose)
      dc.removeEventListener('error', onError)
    }
    dc.addEventListener('open', onOpen)
    dc.addEventListener('close', onClose)
    dc.addEventListener('error', onError)
  })
}


