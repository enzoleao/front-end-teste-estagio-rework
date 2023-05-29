import { ContextsProvider } from '@/contexts/useContexts'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <ContextsProvider>
    <Component {...pageProps} />
  </ContextsProvider>
  )
}
