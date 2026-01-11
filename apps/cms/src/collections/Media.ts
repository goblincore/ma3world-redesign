import type { CollectionConfig } from 'payload'
import { revalidateAstro } from '../hooks/revalidateAstro'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAstro],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        description: 'Upload a thumbnail for videos. This will be used in previews.',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*'],
    adminThumbnail: ({ doc }: any) => {
      if (doc.mimeType?.startsWith('video/')) {
        if (doc.thumbnail) {
          // If thumbnail is an object (populated), use its url
          if (typeof doc.thumbnail === 'object') {
            return doc.thumbnail.url || doc.thumbnail.thumbnailURL
          }
          // If it's just an ID, we can't easily get the URL here synchronously.
          // However, we could return a placeholder or try to rely on the fact that
          // Payload might have populated it in some contexts.
        }
        // Fallback to a generic video icon to avoid broken image in Chrome
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
      }
      return doc.url
    },
  },
}
