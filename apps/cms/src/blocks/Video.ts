import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    {
      name: 'video',
      label: 'Video File',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'video' },
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'text',
      localized: true,
    },
  ],
}
