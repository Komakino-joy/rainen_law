import Layout from '../components/layout'
import Router from 'next/router'
import NProgress from 'nprogress'

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
  //Binding events. 
  Router.events.on('routeChangeStart', () => NProgress.start()) 
  Router.events.on('routeChangeComplete', () => NProgress.done()) 
  Router.events.on('routeChangeError', () => NProgress.done())

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