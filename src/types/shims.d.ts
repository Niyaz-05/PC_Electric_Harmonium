// Minimal React + JSX shims to quiet TS until dependencies are installed
declare module 'react' {
  export function useState<T = any>(initial?: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void]
  export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void
  export function useRef<T = any>(initial?: T): { current: T }
  export function useMemo<T = any>(factory: () => T, deps?: any[]): T
  export const StrictMode: any
  const React: any
  export default React
}

declare namespace JSX {
  interface IntrinsicElements { [elemName: string]: any }
  interface Element { }
  interface ElementClass { }
  interface ElementAttributesProperty { props?: any }
  interface ElementChildrenAttribute { children?: any }
}

declare module 'react/jsx-runtime' {
  export const jsx: any
  export const jsxs: any
  export const Fragment: any
}

declare module 'react-dom/client' {
  export function createRoot(container: any): { render(children: any): void }
}

// Animations
declare module 'framer-motion' {
  export const motion: any
}

// Vite plugin (used in vite.config.ts)
declare module '@vitejs/plugin-react' {
  const plugin: any
  export default plugin
}

// Vite core (defineConfig helper)
declare module 'vite' {
  export function defineConfig(config: any): any
}
