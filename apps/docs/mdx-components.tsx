import type { MDXComponents } from 'nextra/mdx-components'

// See: https://nextjs.org/docs/app/building-your-application/configuring/mdx#customizing-mdx-components
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Add custom MDX components here, e.g. code blocks, callouts, etc.
    ...components,
  }
}
