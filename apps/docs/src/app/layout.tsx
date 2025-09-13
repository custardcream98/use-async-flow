import type { ReactNode } from 'react'

import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

import './globals.css'

export const metadata = {
  title: 'use-async-overlay',
  description: '선언적으로 오버레이를 그리고, 명령형으로 컨트롤하세요.',
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
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
