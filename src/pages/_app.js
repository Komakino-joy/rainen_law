import Layout from '../components/layout'
import '../styles/globals.scss'
import '../styles/tables.scss'
import '../styles/forms.scss'
import '../styles/layout.scss'
import '../styles/pages.scss'
import { Roboto } from '@next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Layout>
        <main className={`app-content ${roboto.className}`}  >
          <Component {...pageProps} />
        </main>
      </Layout>
      <div id="modal-root"></div>
    </>
  )
}