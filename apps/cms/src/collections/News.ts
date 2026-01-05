import type { CollectionConfig } from 'payload'
import { revalidateAstro } from '../hooks/revalidateAstro'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'linkType', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateAstro],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "tokyo-design-week-2024")',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy/MM/dd',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Short summary for listing pages',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Full article content for the detail page',
      },
    },
    {
      name: 'linkType',
      type: 'radio',
      defaultValue: 'detail',
      options: [
        { label: 'News Detail Page', value: 'detail' },
        { label: 'Link to Project', value: 'project' },
        { label: 'External URL', value: 'external' },
      ],
      admin: {
        layout: 'horizontal',
        description: 'Where should clicking this news item go?',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        condition: (data) => data?.linkType === 'project',
        description: 'Link to an existing project',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        condition: (data) => data?.linkType === 'external',
        description: 'External URL to link to',
      },
    },
  ],
}

