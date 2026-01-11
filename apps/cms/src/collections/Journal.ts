import type { CollectionConfig } from 'payload'
import { revalidateAstro } from '../hooks/revalidateAstro'

export const Journal: CollectionConfig = {
  slug: 'journal',
  labels: {
    singular: {
      en: 'Journal',
      ja: 'ジャーナル',
    },
    plural: {
      en: 'Journal',
      ja: 'ジャーナル',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'updatedAt'],
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
      label: {
        en: 'Title',
        ja: 'タイトル',
      },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: {
          en: 'URL-friendly identifier (e.g., "my-first-journal-post")',
          ja: 'URL用識別子（例: my-first-journal-post）',
        },
      },
    },
    {
      name: 'date',
      label: {
        en: 'Publish Date',
        ja: '公開日',
      },
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
      label: {
        en: 'Featured Image',
        ja: 'アイキャッチ画像',
      },
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      label: {
        en: 'Summary',
        ja: '概要',
      },
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: {
          en: 'Short summary for listing pages',
          ja: '一覧ページ用の短い概要文',
        },
      },
    },
    {
      name: 'content',
      label: {
        en: 'Journal Content',
        ja: 'ジャーナル内容',
      },
      type: 'richText',
      localized: true,
      admin: {
        description: {
          en: 'Full journal content for the detail page',
          ja: '詳細ページ用の内容（リッチテキスト）',
        },
      },
    },
    {
      name: 'tags',
      label: {
        en: 'Tags',
        ja: 'タグ',
      },
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
