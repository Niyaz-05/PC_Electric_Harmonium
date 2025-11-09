import { useEffect } from 'react'
import { Keyboard } from './components/Keyboard'
import { Bellows } from './components/Bellows'
import { SettingsPanel } from './components/SettingsPanel'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [theme, setTheme] = useLocalStorage<'light'|'dark'>('harmonipc-theme', 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const [octave, setOctave] = useLocalStorage<number>('harmonipc-octave', 4)
  const [scale, setScale] = useLocalStorage<string>('harmonipc-scale', 'C Major')
  const [reedMode, setReedMode] = useLocalStorage<'single'|'double'|'triple'>('harmonipc-reed', 'double')
  const [tuning, setTuning] = useLocalStorage<'equal'|'just'>('harmonipc-tuning', 'equal')
  const [refA, setRefA] = useLocalStorage<number>('harmonipc-refA', 440)
  const [autoBellows, setAutoBellows] = useLocalStorage<boolean>('harmonipc-auto-bellows', true)

  const engine = useAudioEngine({ reedMode, tuning, refA })

  useEffect(() => {
    engine.setReedMode(reedMode)
    engine.setTuning({ system: tuning, refA })
  }, [engine, reedMode, tuning, refA])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        e.preventDefault()
        setOctave(o => Math.min(7, o + 1))
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        setOctave(o => Math.max(1, o - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOctave])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950">
      <header className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-semibold">HarmoniPC</h1>
        <p className="opacity-70">Real Harmonium on Your Laptop</p>
      </header>

      <main className="flex-1 grid grid-rows-[auto,1fr] gap-4 md:gap-6 px-4 md:px-6">
        <SettingsPanel
          theme={theme}
          onTheme={setTheme}
          octave={octave}
          onOctave={setOctave}
          scale={scale}
          onScale={setScale}
          reedMode={reedMode}
          onReedMode={setReedMode}
          tuning={tuning}
          onTuning={setTuning}
          refA={refA}
          onRefA={setRefA}
          autoBellows={autoBellows}
          onAutoBellows={setAutoBellows}
        />

        <section className="grid md:grid-cols-[1fr,380px] gap-6 items-stretch">
          <div className="rounded-xl border border-neutral-200/20 bg-neutral-900/30 p-3 md:p-4">
            <Keyboard engine={engine} octave={octave} />
          </div>
          <div className="rounded-xl border border-neutral-200/20 bg-neutral-900/30 p-3 md:p-4">
            <Bellows engine={engine} auto={autoBellows} />
          </div>
        </section>
      </main>

      <footer className="p-4 md:p-6 opacity-60 text-sm">
        <p>Tip: Use your laptop keyboard. Drag in the bellows area to pump air.</p>
      </footer>
    </div>
  )
}
