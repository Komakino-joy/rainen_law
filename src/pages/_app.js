import Layout from '../components/layout'
import '../styles/globals.scss'
import '../styles/tables.scss'
import '../styles/forms.scss'
import '../styles/layout.scss'
import '../styles/pages.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Layout>
        <section className='app-content' >
          <Component {...pageProps} />
        </section>
      </Layout>
      <div id="modal-root"></div>
    </>
  )
}