export function PressureGauge({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="w-28 h-10 rounded bg-neutral-900/60 border border-neutral-700/60 p-1">
      <div className="w-full h-full rounded bg-gradient-to-r from-emerald-500/70 to-orange-500/70" style={{ width: pct + '%' }} />
    </div>
  )
}
