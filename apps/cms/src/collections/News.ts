import type { CollectionConfig } from 'payload'
import { revalidateAstro } from '../hooks/revalidateAstro'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: {
      en: 'News',
      ja: 'ニュース',
    },
    plural: {
      en: 'News',
      ja: 'ニュース',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'linkType', 'updatedAt'],
    livePreview: {
      url: ({ data }) => `http://localhost:4321/ma3world-redesign/news/${data.slug}`,
    },
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
          en: 'URL-friendly identifier (e.g., "tokyo-design-week-2024")',
          ja: 'URL用識別子（例: tokyo-design-week-2024）',
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
        en: 'Article Content',
        ja: '記事本文',
      },
      type: 'richText',
      localized: true,
      admin: {
        description: {
          en: 'Full article content for the detail page',
          ja: '詳細ページ用の記事本文（リッチテキスト）',
        },
      },
    },
    {
      name: 'linkType',
      label: {
        en: 'Click Behavior',
        ja: 'クリック時の動作',
      },
      type: 'radio',
      defaultValue: 'detail',
      options: [
        { label: { en: 'News Detail Page', ja: 'ニュース詳細ページ' }, value: 'detail' },
        { label: { en: 'Link to Project', ja: 'プロジェクトへリンク' }, value: 'project' },
        { label: { en: 'External URL', ja: '外部リンク' }, value: 'external' },
      ],
      admin: {
        layout: 'horizontal',
        description: {
          en: 'Where should clicking this news item go?',
          ja: 'このニュース項目をクリックした際の遷移先',
        },
      },
    },
    {
      name: 'project',
      label: {
        en: 'Related Project',
        ja: '関連プロジェクト',
      },
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        condition: (data) => data?.linkType === 'project',
        description: {
          en: 'Link to an existing project',
          ja: '既存のプロジェクトにリンクします',
        },
      },
    },
    {
      name: 'externalUrl',
      label: {
        en: 'External URL',
        ja: '外部リンクURL',
      },
      type: 'text',
      admin: {
        condition: (data) => data?.linkType === 'external',
        description: {
          en: 'External URL to link to',
          ja: 'リンク先のプロトコルを含むURL（例: https://example.com）',
        },
      },
    },
  ],
}

