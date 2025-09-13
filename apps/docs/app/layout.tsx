import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'use-async-overlay',
  description: 'Promise-based overlay control hook for React',
}

const navbar = <Navbar logo={<b>use-async-overlay</b>} />
const footer = <Footer>MIT {new Date().getFullYear()} © use-async-overlay.</Footer>

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout navbar={navbar} footer={footer} pageMap={await getPageMap()}>
          {children}
        </Layout>
      </body>
    </html>
  )
}
