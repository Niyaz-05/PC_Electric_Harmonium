import { useEffect, useRef, useState } from 'react'
import { PressureGauge } from './PressureGauge'

export function Bellows({ engine, auto }: { engine: any, auto: boolean }) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [pressure, setPressure] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    let lastTime = 0
    let lastX = 0, lastY = 0
    let p = auto ? 0.6 : 0
    setPressure(p)
    engine.setPressure(p)

    const onPointerDown = (e: PointerEvent) => {
      if (!areaRef.current?.contains(e.target as Node)) return
      setDragging(true)
      lastTime = performance.now()
      lastX = e.clientX; lastY = e.clientY
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dt = Math.max(1, now - lastTime)
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const speed = Math.sqrt(dx*dx + dy*dy) / dt // px per ms
      lastTime = now; lastX = e.clientX; lastY = e.clientY
      // Map speed → pressure (0..1) with smoothing
      p = Math.max(0, Math.min(1, p * 0.9 + speed * 0.5))
      setPressure(p)
      engine.setPressure(p)
    }
    const onPointerUp = () => { setDragging(false); if (!auto) { p = 0; setPressure(0); engine.setPressure(0) } }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [auto])

  return (
    <div ref={areaRef} className="h-64 md:h-full min-h-[220px] rounded-lg overflow-hidden bg-gradient-to-br from-wood-light/80 to-wood-dark/80 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-5/6 h-40 md:h-56 bg-neutral-900/30 rounded-xl border border-neutral-800/40 backdrop-blur-sm">
          <div className="h-full w-full grid grid-cols-6">
            {Array.from({ length: 6 }).map((_,i) => (
              <div key={i} className="border-x border-neutral-800/40" style={{ filter: `brightness(${1 + pressure*0.3})` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute right-3 top-3">
        <PressureGauge value={pressure} />
      </div>
      <div className="absolute left-3 top-3 text-xs opacity-80 bg-black/30 text-white px-2 py-1 rounded">{auto ? 'Auto-bellows' : 'Manual'}</div>
    </div>
  )
}
