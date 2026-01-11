import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: {
      en: 'Tag',
      ja: 'タグ',
    },
    plural: {
      en: 'Tags',
      ja: 'タグ',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: {
        en: 'Name',
        ja: '名前',
      },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: {
          en: 'URL-friendly identifier (e.g., "culture")',
          ja: 'URL用識別子（例: culture）',
        },
      },
    },
  ],
}
