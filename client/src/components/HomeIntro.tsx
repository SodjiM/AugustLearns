import { useAppStore } from '../store'

export function HomeIntro() {
  const { tokenStatus } = useAppStore()

  const call = (name: string, args: any = {}) => {
    try { (window as any)?.oaiSession?.callTool?.(name, args) } catch {}
  }

  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="px-4 py-3 border-b bg-white">
        <div className="text-lg font-bold">Welcome to Hummingbird Tutor</div>
        <div className="text-sm text-slate-500">Learn by talking and drawing—just press Talk and speak.</div>
      </div>
      <div className="p-6 overflow-auto">
        <div className="max-w-2xl space-y-6">
          <section className="space-y-2">
            <div className="text-base font-semibold">Try saying</div>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>“Show me all the modules.”</li>
              <li>“Open the barn animals module.”</li>
              <li>“Let’s set up my profile.”</li>
              <li>“Sing the ABCs with me.”</li>
              <li>“Make the volume quieter.”</li>
            </ul>
            <div className="text-xs text-slate-500">Status: {tokenStatus === 'ok' ? 'Connected' : tokenStatus === 'loading' ? 'Connecting…' : 'Idle'}</div>
          </section>

          <section className="space-y-3">
            <div className="text-base font-semibold">Quick actions</div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 rounded bg-slate-200" onClick={() => call('filter_modules', {})}>Show modules</button>
              <button className="px-3 py-1 rounded bg-slate-200" onClick={() => call('open_profile')}>Open profile</button>
              <button className="px-3 py-1 rounded bg-slate-200" onClick={() => call('goto_module', { id: 'science.barn-animals.identify' })}>Try Barn Animals</button>
              <button className="px-3 py-1 rounded bg-slate-200" onClick={() => call('goto_module', { id: 'literacy.abcs.singalong' })}>Sing ABCs</button>
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-base font-semibold">How it works</div>
            <p className="text-slate-700">Press the Talk button to start a conversation. The tutor listens and responds with voice. It can also draw on the notepad, show modules, and adjust settings when you ask.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

