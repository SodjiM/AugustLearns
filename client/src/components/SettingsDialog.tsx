import { useEffect, useState } from 'react'
import { ProfileAvatarPicker } from './ProfileAvatarPicker'
import { useProfileStore } from '../stores/profileStore'
import { registerUiBus } from '../uiBridge'

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const { profile, update, profiles, switchProfile, loadFromDb, createProfile, toggleFavoriteSubject, togglePreferredModality, toggleFavoriteTheme } = useProfileStore()
  useEffect(() => {
    registerUiBus({ openProfile: () => setOpen(true), closeProfile: () => setOpen(false) })
    void loadFromDb()
  }, [])
  return (
    <div>
      <button className="px-2 py-1 text-xs rounded bg-slate-200" onClick={() => setOpen(true)}>Profile</button>
      {open && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center">
          <div className="bg-white rounded-xl p-4 w-[560px] max-w-[95vw] shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Your Profile</div>
              <button className="text-slate-500" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ProfileAvatarPicker />
              </div>
              <div className="space-y-3">
                <LabeledInput label="Name" value={profile.displayName} onChange={(v) => update({ displayName: v })} />
                <LabeledInput label="Grade" value={profile.grade || ''} onChange={(v) => update({ grade: v })} />
                <LabeledInput label="Age Band" value={profile.ageBand} onChange={(v) => update({ ageBand: v as any })} />
                <LabeledInput label="Language" value={profile.language} onChange={(v) => update({ language: v })} />
                <fieldset className="border rounded p-2">
                  <legend className="text-xs text-slate-500">Preferences</legend>
                  <div className="text-xs text-slate-500 mb-2">Tap to toggle favorites; you can also say things like "remember I love dinosaurs" or "I like drawing more than quizzes".</div>
                  <ChipRow label="Subjects" chips={['math','reading','science','creativity']} selected={profile.favoriteSubjects} onToggle={(v)=>toggleFavoriteSubject(v as any)} />
                  <ChipRow label="Modalities" chips={['draw','game','quiz','story','voice']} selected={profile.preferredModalities} onToggle={(v)=>togglePreferredModality(v as any)} />
                  <ChipRow label="Themes" chips={['space','animals','dinosaurs','soccer','bluey']} selected={profile.favoriteThemes} onToggle={(v)=>toggleFavoriteTheme(v)} />
                </fieldset>
                <fieldset className="border rounded p-2">
                  <legend className="text-xs text-slate-500">Accessibility</legend>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.captions} onChange={(e)=>update({ captions: e.target.checked })}/> Captions</label>
                </fieldset>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 text-xs rounded bg-indigo-600 text-white" onClick={() => update({ id: `kid-${Date.now()}` })}>Make this my profile</button>
                  <button className="px-2 py-1 text-xs rounded bg-slate-200" onClick={() => createProfile('New Kid')}>New Profile</button>
                  {profiles.length > 1 && (
                    <select className="text-sm border rounded px-2 py-1" value={profile.id} onChange={(e)=>switchProfile(e.target.value)}>
                      {profiles.map(p => <option key={p.id} value={p.id}>{p.displayName}</option>)}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SettingsDialogButton() { return <SettingsDialog /> }

function LabeledInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <div className="text-slate-600 mb-1">{label}</div>
      <input className="w-full border rounded px-2 py-1" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function ChipRow({ label, chips, selected, onToggle }: { label: string, chips: string[], selected: string[], onToggle: (v: string) => void }) {
  return (
    <div className="mt-2">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {chips.map(c => {
          const is = selected.includes(c)
          return (
            <button key={c} onClick={()=>onToggle(c)} className={`text-xs px-2 py-1 rounded-full border ${is ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-slate-50'}`}>{c}</button>
          )
        })}
      </div>
    </div>
  )
}


