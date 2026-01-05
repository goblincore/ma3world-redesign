import type { CollectionAfterChangeHook } from 'payload'

export const revalidateAstro: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation === 'create' || operation === 'update' || operation === 'delete') {
    const GITHUB_PAT = process.env.GITHUB_PAT
    const OWNER = process.env.GITHUB_REPO_OWNER || 'goblincore'
    const REPO = process.env.GITHUB_REPO_NAME || 'ma3world-redesign'

    if (!GITHUB_PAT) {
      console.warn('GITHUB_PAT not found, skipping Astro revalidation')
      return doc
    }

    console.log(`Triggering GitHub build for ${OWNER}/${REPO}...`)

    try {
      const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/pages/builds`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'PayloadCMS-Webhook',
        },
      })

      if (response.ok) {
        console.log('Successfully triggered GitHub build')
      } else {
        const error = await response.text()
        console.error('Failed to trigger GitHub build:', error)
      }
    } catch (err) {
      console.error('Error triggering GitHub build:', err)
    }
  }

  return doc
}
