import React from 'react'

const config = {
  logo: <span>use-async-flow</span>,
  project: {
    link: 'https://github.com/your-org/use-async-flow',
  },
  docsRepositoryBase: 'https://github.com/your-org/use-async-flow/tree/main/apps/docs',
  head: () => (
    <>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta content="Promise-based overlay control hook for React" name="description" />
    </>
  ),
  footer: {
    text: 'use-async-flow',
  },
  search: {
    provider: 'algolia',
    options: {
      appId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID,
      apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY,
      indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX,
    },
  },
}

export default config
