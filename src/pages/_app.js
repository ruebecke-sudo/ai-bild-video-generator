import '../styles.css'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export default function App({ Component, pageProps }) {
  return (
    <main className={outfit.variable}>
      <Component {...pageProps} />
    </main>
  )
}
