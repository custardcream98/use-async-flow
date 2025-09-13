import type { ReactNode } from 'react'

import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

import './globals.css'

export const metadata = {
  title: 'use-async-overlay',
  description: 'Promise-based overlay control hook for React',
}

const navbar = <Navbar logo={<b>use-async-overlay</b>} />
const footer = <Footer>MIT {new Date().getFullYear()} © use-async-overlay.</Footer>

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html dir="ltr" lang="ko" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          docsRepositoryBase="https://github.com/custardcream98/use-async-overlay"
          footer={footer}
          navbar={navbar}
          pageMap={await getPageMap()}
          sidebar={{
            defaultOpen: false,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
