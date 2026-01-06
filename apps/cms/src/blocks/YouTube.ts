import type { Block } from 'payload'

export const YouTube: Block = {
  slug: 'youtube',
  labels: {
    singular: 'YouTube Video',
    plural: 'YouTube Videos',
  },
  fields: [
    {
      name: 'url',
      label: 'YouTube URL',
      type: 'text',
      required: true,
      admin: {
        description: 'Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
