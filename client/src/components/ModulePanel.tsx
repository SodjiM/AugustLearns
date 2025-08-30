import { useModuleStore } from '../stores/moduleStore'
import { useAppStore } from '../store'

export function ModulePanel() {
  const { view } = useModuleStore()
  return (
    <div className="space-y-3">
      {view.chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {view.chips.map((c) => (
            <span key={c} className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">{c}</span>
          ))}
        </div>
      )}
      {view.sections.map((s) => (
        <Section key={s.id} title={s.title}>
          <div className="grid gap-2">
            {s.modules.map((m) => (
              <ModuleRow key={m.id} id={m.id} title={m.title} subject={m.subject} duration={m.duration} />
            ))}
          </div>
        </Section>
      ))}
    </div>
  )}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{title}</div>
      {children}
    </div>
  )
}

function ModuleRow({ id, title, subject, duration }: { id: string; title: string; subject: string; duration: number }) {
  const { activeModuleId, setActiveModule } = useAppStore()
  const active = activeModuleId === id
  const color = subject === 'math' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
  return (
    <button onClick={() => setActiveModule(id)} className={`w-full text-left border rounded-lg p-2 flex items-center justify-between ${active ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-slate-50'}`}>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-slate-500">{duration} min</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>{subject}</span>
    </button>
  )
}


