// Group staged files by workspace and run ESLint from the workspace root
// to ensure ESLint v9 loads the nearest eslint.config.mjs.

/**
 * @param {string[]} files
 */
function groupByWorkspace(files) {
  const groups = [
    { root: 'apps/docs', files: [] },
    { root: 'packages/use-async-flow', files: [] },
  ]

  for (const file of files) {
    const found = groups.find(
      (g) => file.startsWith(`${process.cwd()}/${g.root}`) || file.startsWith(g.root)
    )
    if (found) {
      found.files.push(file)
    }
  }

  return groups.filter((g) => g.files.length > 0)
}

export default {
  '**/*.{ts,tsx,js,jsx,mjs,cjs,cts,mts}': (files) => {
    const groups = groupByWorkspace(files)
    const cmds = []
    for (const g of groups) {
      cmds.push(`pnpm --filter ./${g.root} exec eslint --fix ${g.files.join(' ')}`)
    }
    return cmds
  },
  '**/*.{json,md,mdx,yml,yaml,css,scss}': (files) => {
    return [`prettier --write ${files.join(' ')}`]
  },
}
