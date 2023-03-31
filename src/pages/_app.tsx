import Router from 'next/router'
import NProgress from 'nprogress'
import { AppProps } from 'next/app'
import Layout from '../components/layout'
import { AuthProvider } from '../context/AuthContext';

import '../styles/globals.scss'
import '../styles/tables.scss'
import '../styles/forms.scss'
import '../styles/layout.scss'
import '../styles/pages.scss'
import '../styles/confirm-alert.scss'
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Roboto } from '@next/font/google'
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const MyApp = ({ Component, pageProps }: AppProps) => {
  //Binding events. 
  Router.events.on('routeChangeStart', () => NProgress.start()) 
  Router.events.on('routeChangeComplete', () => NProgress.done()) 
  Router.events.on('routeChangeError', () => NProgress.done())

  return (
    <AuthProvider>
      {/* @ts-ignore */}
      <Layout>
        <main className={`app-content ${roboto.className}`}  >
          <Component {...pageProps} />
        </main>
      </Layout>
      <div id="modal-root"></div>
      <Toaster />
    </AuthProvider>
  )
}

export default MyApp