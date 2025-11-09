import { useMemo, useRef } from 'react'

export type ReedMode = 'single' | 'double' | 'triple'
export type TuningSystem = 'equal' | 'just'

function midiToFreqEqual(midi: number, refA: number) {
  return refA * Math.pow(2, (midi - 69) / 12)
}

class Voice {
  private ctx: AudioContext
  private gain: GainNode
  private filter: BiquadFilterNode
  private oscillators: OscillatorNode[] = []
  private active = false
  private _midi: number
  private pressureGetter: () => number
  private releaseSeconds = 0.18

  constructor(ctx: AudioContext, dest: AudioNode, midi: number, reedMode: ReedMode, freq: number, pressureGetter: () => number) {
    this.ctx = ctx
    this._midi = midi
    this.pressureGetter = pressureGetter

    this.gain = ctx.createGain()
    this.gain.gain.value = 0

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 1200
    this.filter.Q.value = 0.7

    this.gain.connect(this.filter)
    this.filter.connect(dest)

    const count = reedMode === 'triple' ? 3 : reedMode === 'double' ? 2 : 1
    const detunes = count === 1 ? [0] : count === 2 ? [-6, +6] : [-8, 0, +8]

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      osc.detune.value = detunes[i]
      const sg = ctx.createGain()
      sg.gain.value = 1 / count
      osc.connect(sg).connect(this.gain)
      this.oscillators.push(osc)
    }
  }

  get midi() { return this._midi }

  start() {
    if (this.active) return
    const now = this.ctx.currentTime
    for (const osc of this.oscillators) osc.start()
    const p = this.pressureGetter()
    // Fast attack scaled by pressure
    const target = Math.max(0.0001, Math.min(1, p))
    const atk = 0.01 + (1 - p) * 0.08
    this.gain.gain.cancelScheduledValues(now)
    this.gain.gain.setValueAtTime(0.0001, now)
    this.gain.gain.exponentialRampToValueAtTime(target, now + atk)
    this.active = true
  }

  updatePressure(p: number) {
    if (!this.active) return
    const now = this.ctx.currentTime
    // Map pressure to filter brightness and level
    const cutoff = 800 + p * 2600
    this.filter.frequency.setTargetAtTime(cutoff, now, 0.02)
    const target = Math.max(0.0001, Math.min(1, p))
    this.gain.gain.setTargetAtTime(target, now, 0.04)
  }

  stop() {
    if (!this.active) return
    const now = this.ctx.currentTime
    const end = now + this.releaseSeconds
    this.gain.gain.cancelScheduledValues(now)
    this.gain.gain.setValueAtTime(this.gain.gain.value || 0.0001, now)
    this.gain.gain.exponentialRampToValueAtTime(0.0001, end)
    for (const osc of this.oscillators) osc.stop(end)
    // Let GC clean up after stop time passes
    this.active = false
  }
}

export function useAudioEngine(opts: { reedMode: ReedMode, tuning: TuningSystem, refA: number }) {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const pressureRef = useRef(0.6)
  const voicesRef = useRef<Map<number, Voice>>(new Map())
  const stateRef = useRef({ reedMode: opts.reedMode, tuning: opts.tuning, refA: opts.refA })

  function ensureAudio() {
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = ctx
      const master = ctx.createGain()
      master.gain.value = 0.8
      master.connect(ctx.destination)
      masterRef.current = master
    }
    return ctxRef.current!
  }

  const api = useMemo(() => ({
    setPressure(p: number) {
      pressureRef.current = Math.max(0, Math.min(1, p))
      const ctx = ctxRef.current
      if (!ctx) return
      const vmap = voicesRef.current
      for (const v of vmap.values()) v.updatePressure(pressureRef.current)
    },
    async startNote(midi: number, velocity = 1) {
      const ctx = ensureAudio()
      await ctx.resume().catch(() => {})
      const existing = voicesRef.current.get(midi)
      if (existing) {
        existing.updatePressure(pressureRef.current)
        return
      }
      const freq = midiToFreqEqual(midi, stateRef.current.refA)
      const v = new Voice(ctx, masterRef.current!, midi, stateRef.current.reedMode, freq, () => pressureRef.current * velocity)
      voicesRef.current.set(midi, v)
      v.start()
      v.updatePressure(pressureRef.current)
    },
    stopNote(midi: number) {
      const v = voicesRef.current.get(midi)
      if (!v) return
      v.stop()
      voicesRef.current.delete(midi)
    },
    setReedMode(m: ReedMode) {
      stateRef.current.reedMode = m
    },
    setTuning(t: { system: TuningSystem, refA: number }) {
      stateRef.current.tuning = t.system
      stateRef.current.refA = t.refA
    },
  }), [])

  return api
}
