import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { keyToSemitone, codeToLabel } from '../lib/mapping'

export function Keyboard({ engine, octave }: { engine: any, octave: number }) {
  const [pressed, setPressed] = useState(new Set<string>())
  const pressedRef = useRef(new Set<string>())
  const activeNotesRef = useRef(new Map<string, number>())
  const baseMidi = 12 * (octave + 1) // C octave base

  const keyLayout: string[] = [
    'KeyZ','KeyS','KeyX','KeyD','KeyC','KeyV','KeyG','KeyB','KeyH','KeyN','KeyJ','KeyM','Comma','KeyL','Period','Semicolon','Slash'
  ]

  const down = (code: string, velocity = 1) => {
    if (pressedRef.current.has(code)) return
    const semi = keyToSemitone[code]
    if (semi === undefined) return
    const midi = baseMidi + semi
    pressedRef.current.add(code)
    activeNotesRef.current.set(code, midi)
    engine.startNote(midi, velocity)
    setPressed(new Set(pressedRef.current))
  }

  const up = (code: string) => {
    if (!pressedRef.current.has(code)) return
    const midi = activeNotesRef.current.get(code)
    if (midi === undefined) return
    engine.stopNote(midi)
    pressedRef.current.delete(code)
    activeNotesRef.current.delete(code)
    setPressed(new Set(pressedRef.current))
  }

  const releaseAll = () => {
    for (const midi of activeNotesRef.current.values()) {
      engine.stopNote(midi)
    }
    pressedRef.current.clear()
    activeNotesRef.current.clear()
    setPressed(new Set())
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      down(e.code)
    }
    const onKeyUp = (e: KeyboardEvent) => up(e.code)
    const onVisibilityChange = () => {
      if (document.hidden) releaseAll()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', releaseAll)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', releaseAll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [baseMidi, engine])

  const Key = ({ code, label }: any) => {
    const black = label.includes('#')
    return (
      <motion.button
        onPointerDown={(e) => { e.preventDefault(); down(code, 1); }}
        onPointerUp={() => up(code)}
        onPointerLeave={() => up(code)}
        className={
          (black
            ? 'h-36 w-10 rounded-md bg-neutral-900 text-neutral-100'
            : 'h-40 w-12 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-300'
          ) + ' relative flex items-end justify-center pb-2 select-none'}
        animate={{ scale: pressed.has(code) ? 0.98 : 1, boxShadow: pressed.has(code) ? 'inset 0 2px 10px rgba(0,0,0,0.35)' : '0 2px 0 rgba(0,0,0,0.05)'}}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        title={label}
      >
        <span className={black ? 'text-xs' : 'text-sm'}>{label}</span>
      </motion.button>
    )
  }

  return (
    <div>
      <div className="text-sm opacity-70 mb-2">Press laptop keys. Arrow Up/Down changes octave.</div>
      <div className="w-full overflow-x-auto">
        <div className="flex gap-1 justify-start min-w-max">
          {keyLayout.map(code => (
            <Key key={code} code={code} label={codeToLabel[code] ?? code} />
          ))}
        </div>
      </div>
    </div>
  )
}
