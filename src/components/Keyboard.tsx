import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { keyToSemitone, codeToLabel } from '../lib/mapping'

export function Keyboard({ engine, octave }: { engine: any, octave: number }) {
  const [pressed, setPressed] = useState(new Set<string>())
  const baseMidi = 12 * (octave + 1) // C octave base

  const keyLayout: string[] = [
    'KeyZ','KeyS','KeyX','KeyD','KeyC','KeyV','KeyG','KeyB','KeyH','KeyN','KeyJ','KeyM','Comma','KeyL','Period','Semicolon','Slash'
  ]

  const down = (code: string, velocity = 1) => {
    if (pressed.has(code)) return
    const semi = keyToSemitone[code]
    if (semi === undefined) return
    const midi = baseMidi + semi
    engine.startNote(midi, velocity)
    setPressed(prev => new Set(prev).add(code))
  }

  const up = (code: string) => {
    if (!pressed.has(code)) return
    const semi = keyToSemitone[code]
    if (semi === undefined) return
    const midi = baseMidi + semi
    engine.stopNote(midi)
    setPressed(prev => {
      const n = new Set(prev)
      n.delete(code)
      return n
    })
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      down(e.code)
    }
    const onKeyUp = (e: KeyboardEvent) => up(e.code)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [baseMidi])

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
