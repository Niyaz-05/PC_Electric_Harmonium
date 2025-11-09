// KeyboardEvent.code -> semitone offset from base C
// Layout mapping (two octaves across Z/M rows)
// Z C, S C#, X D, D D#, C E, V F, G F#, B G, H G#, N A, J A#, M B
// , C, L C#, . D, ; D#, / E
export const keyToSemitone: Record<string, number> = {
  KeyZ: 0,
  KeyS: 1,
  KeyX: 2,
  KeyD: 3,
  KeyC: 4,
  KeyV: 5,
  KeyG: 6,
  KeyB: 7,
  KeyH: 8,
  KeyN: 9,
  KeyJ: 10,
  KeyM: 11,
  Comma: 12,
  KeyL: 13,
  Period: 14,
  Semicolon: 15,
  Slash: 16,
}

export const codeToLabel: Record<string, string> = {
  KeyZ: 'C', KeyS: 'C#', KeyX: 'D', KeyD: 'D#', KeyC: 'E',
  KeyV: 'F', KeyG: 'F#', KeyB: 'G', KeyH: 'G#', KeyN: 'A', KeyJ: 'A#', KeyM: 'B',
  Comma: 'C', KeyL: 'C#', Period: 'D', Semicolon: 'D#', Slash: 'E',
}
