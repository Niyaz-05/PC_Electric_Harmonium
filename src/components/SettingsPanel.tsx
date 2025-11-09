type Props = {
  theme: 'light'|'dark', onTheme: (t: 'light'|'dark') => void
  octave: number, onOctave: (o: number) => void
  scale: string, onScale: (s: string) => void
  reedMode: 'single'|'double'|'triple', onReedMode: (m: 'single'|'double'|'triple') => void
  tuning: 'equal'|'just', onTuning: (t: 'equal'|'just') => void
  refA: number, onRefA: (n: number) => void
  autoBellows: boolean, onAutoBellows: (v: boolean) => void
}

const scales = ['C Major','D Minor','E Minor','G Major','A Minor']

export function SettingsPanel(p: Props) {
  return (
    <div className="rounded-xl border border-neutral-200/20 bg-neutral-900/30 p-3 md:p-4 grid md:grid-cols-3 gap-3 text-sm">
      <div className="flex items-center gap-2">
        <label className="opacity-70 w-24">Theme</label>
        <select className="px-2 py-1 rounded bg-neutral-800" value={p.theme} onChange={e => p.onTheme(e.target.value as any)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="opacity-70 w-24">Octave</label>
        <input className="px-2 py-1 rounded bg-neutral-800 w-24" type="number" min={1} max={7} value={p.octave} onChange={e => p.onOctave(parseInt(e.target.value||'0')||4)} />
      </div>

      <div className="flex items-center gap-2">
        <label className="opacity-70 w-24">Scale</label>
        <select className="px-2 py-1 rounded bg-neutral-800" value={p.scale} onChange={e => p.onScale(e.target.value)}>
          {scales.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="opacity-70 w-24">Reeds</label>
        <select className="px-2 py-1 rounded bg-neutral-800" value={p.reedMode} onChange={e => p.onReedMode(e.target.value as any)}>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="opacity-70 w-24">Tuning</label>
        <select className="px-2 py-1 rounded bg-neutral-800" value={p.tuning} onChange={e => p.onTuning(e.target.value as any)}>
          <option value="equal">Equal</option>
          <option value="just">Just</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="opacity-70 w-24">Ref A</label>
        <input className="px-2 py-1 rounded bg-neutral-800 w-24" type="number" step={1} min={400} max={460} value={p.refA} onChange={e => p.onRefA(parseInt(e.target.value||'440')||440)} />
      </div>

      <div className="flex items-center gap-2">
        <label className="opacity-70 w-24">Bellows</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={p.autoBellows} onChange={e => p.onAutoBellows(e.target.checked)} /> Auto</label>
      </div>
    </div>
  )
}
