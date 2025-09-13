import React from "react";

const config = {
  logo: <span>use-async-overlay</span>,
  project: {
    link: "https://github.com/your-org/use-async-overlay",
  },
  docsRepositoryBase:
    "https://github.com/your-org/use-async-overlay/tree/main/apps/docs",
  head: () => (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Promise-based overlay control hook for React"
      />
    </>
  ),
  footer: {
    text: "use-async-overlay",
  },
  search: {
    provider: "algolia",
    options: {
      appId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID,
      apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY,
      indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX,
    },
  },
};

export default config;
