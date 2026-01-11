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
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*'],
    adminThumbnail: ({ doc }: any) => {
      return doc.url
    },
  },
}
